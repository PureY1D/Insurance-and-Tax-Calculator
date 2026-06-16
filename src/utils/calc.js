// 计算引擎

function fix(n) { return Math.round(n * 100) / 100 }

// 社保计算（企业职工）
export function calcSocial(salary, fundRate, cfg) {
  var s = cfg.social
  var base = Math.max(s.baseMin, Math.min(s.baseMax, salary))
  var fr = Math.max(s.fundMin, Math.min(s.fundMax, fundRate))

  var ep = fix(base * s.employerPension / 100)
  var em = fix(base * s.employerMedical / 100)
  var eu = fix(base * s.employerUnemployment / 100)
  var ei = fix(base * s.employerInjury / 100)
  var ef = fix(base * fr / 100)
  var et = fix(ep + em + eu + ei + ef)

  var pp = fix(base * s.employeePension / 100)
  var pm = fix(base * s.employeeMedical / 100)
  var pu = fix(base * s.employeeUnemployment / 100)
  var pf = fix(base * fr / 100)
  var pt = fix(pp + pm + pu + pf)

  return {
    base: base,
    ep: ep, em: em, eu: eu, ei: ei, ef: ef, et: et,
    pp: pp, pm: pm, pu: pu, pf: pf, pt: pt,
    home: fix(salary - pt)
  }
}

// 灵活就业社保计算
export function calcFlex(base, penRate, medRate, cfg) {
  var f = cfg.flexible
  var b = Math.max(f.baseMin, Math.min(f.baseMax, base))
  var p = fix(b * penRate / 100)
  var m = fix(b * medRate / 100)
  return { p: p, m: m, t: fix(p + m) }
}

// 个税计算（完整版）
export function calcTax(input, cfg) {
  var t = cfg.tax

  // 1. 综合所得计算
  var salary = input.salary || 0           // 工资薪金
  var labor = input.labor || 0             // 劳务报酬
  var author = input.author || 0           // 稿酬
  var royalty = input.royalty || 0         // 特许权使用费

  // 劳务报酬、稿酬、特许权使用费按80%计入
  var laborTax = fix(labor * 0.8)
  var authorTax = fix(author * 0.8 * 0.7)  // 稿酬再打7折
  var royaltyTax = fix(royalty * 0.8)
  var comprehensiveIncome = fix(salary + laborTax + authorTax + royaltyTax)

  // 2. 扣除项目
  var basicDeduction = t.basicDeduction     // 基本减除
  var socialDeduction = input.social || 0   // 五险一金
  var specialTotal = fix(
    (input.childEducation || 0) +
    (input.continuingEducation || 0) +
    (input.housingLoan || 0) +
    (input.housingRent || 0) +
    (input.elderlySupport || 0) +
    (input.infantCare || 0)
  ) * 12

  // 3. 综合所得应纳税所得额
  var comprehensiveTaxable = Math.max(0, fix(
    comprehensiveIncome - basicDeduction - socialDeduction - specialTotal
  ))

  // 4. 综合所得税
  var comprehensiveTax = 0
  var comprehensiveBracket = ''
  var brackets = t.brackets
  for (var i = 0; i < brackets.length; i++) {
    if (brackets[i].max === null || comprehensiveTaxable <= brackets[i].max) {
      comprehensiveTax = fix(comprehensiveTaxable * brackets[i].rate / 100 - brackets[i].deduction)
      comprehensiveBracket = brackets[i].rate + '%'
      break
    }
  }

  // 5. 经营所得
  var businessIncome = input.business || 0
  var businessTax = 0
  var businessBracket = ''
  var bBrackets = t.businessBrackets
  for (var i = 0; i < bBrackets.length; i++) {
    if (bBrackets[i].max === null || businessIncome <= bBrackets[i].max) {
      businessTax = fix(businessIncome * bBrackets[i].rate / 100 - bBrackets[i].deduction)
      businessBracket = bBrackets[i].rate + '%'
      break
    }
  }

  // 6. 比例税率所得（20%）
  var dividend = input.dividend || 0         // 利息股息红利
  var rentIncome = input.rent || 0           // 财产租赁
  var rentDeduction = input.rentDeduction || 0
  var transferIncome = input.transfer || 0   // 财产转让
  var transferCost = input.transferCost || 0
  var luck = input.luck || 0                 // 偶然所得

  var rentTaxable = Math.max(0, fix(rentIncome - rentDeduction))
  var transferTaxable = Math.max(0, fix(transferIncome - transferCost))

  var dividendTax = fix(dividend * 0.2)
  var rentTax = fix(rentTaxable * 0.2)
  var transferTax = fix(transferTaxable * 0.2)
  var luckTax = fix(luck * 0.2)
  var proportionalTax = fix(dividendTax + rentTax + transferTax + luckTax)

  // 7. 合计
  var totalTax = fix(comprehensiveTax + businessTax + proportionalTax)

  return {
    // 综合所得
    comprehensiveIncome: comprehensiveIncome,
    comprehensiveDeduction: fix(basicDeduction + socialDeduction + specialTotal),
    comprehensiveTaxable: comprehensiveTaxable,
    comprehensiveTax: comprehensiveTax,
    comprehensiveBracket: comprehensiveBracket,

    // 经营所得
    businessIncome: businessIncome,
    businessTax: businessTax,
    businessBracket: businessBracket,

    // 比例税率
    dividendTax: dividendTax,
    rentTax: rentTax,
    transferTax: transferTax,
    luckTax: luckTax,
    proportionalTax: proportionalTax,

    // 合计
    totalTax: totalTax,
    monthlyTax: fix(totalTax / 12)
  }
}

export function fmt(n) { return fix(n).toFixed(2) }
