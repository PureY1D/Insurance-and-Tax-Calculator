// 计算引擎

function fix(n) { return Math.round(n * 100) / 100 }

// 社保计算（企业职工）
export function calcSocial(salary, fundBase, fundRate, cfg) {
  var s = cfg.social
  var base = Math.max(s.baseMin, Math.min(s.baseMax, salary))
  var fb = fundBase ? Math.max(s.baseMin, Math.min(s.baseMax, fundBase)) : base
  var fr = Math.max(s.fundMin, Math.min(s.fundMax, fundRate))

  var ep = fix(base * s.employerPension / 100)
  var em = fix(base * s.employerMedical / 100)
  var eu = fix(base * s.employerUnemployment / 100)
  var ei = fix(base * s.employerInjury / 100)
  var ef = fix(fb * fr / 100)
  var et = fix(ep + em + eu + ei + ef)

  var pp = fix(base * s.employeePension / 100)
  var pm = fix(base * s.employeeMedical / 100)
  var pu = fix(base * s.employeeUnemployment / 100)
  var pf = fix(fb * fr / 100)
  var pt = fix(pp + pm + pu + pf)

  return {
    base: base,
    fundBase: fb,
    ep: ep, em: em, eu: eu, ei: ei, ef: ef, et: et,
    pp: pp, pm: pm, pu: pu, pf: pf, pt: pt,
    yearPt: fix(pt * 12)  // 年度个人社保总额
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

// 个税计算
export function calcTax(input, cfg) {
  var t = cfg.tax

  // 1. 综合所得
  var salary = input.salary || 0
  var labor = input.labor || 0
  var author = input.author || 0
  var royalty = input.royalty || 0

  var laborTax = fix(labor * 0.8)
  var authorTax = fix(author * 0.8 * 0.7)
  var royaltyTax = fix(royalty * 0.8)
  var comprehensiveIncome = fix(salary + laborTax + authorTax + royaltyTax)

  // 2. 扣除项目
  var basicDeduction = t.basicDeduction
  var socialDeduction = input.social || 0
  var specialTotal = fix(
    (input.childEducation || 0) + (input.continuingEducation || 0) +
    (input.housingLoan || 0) + (input.housingRent || 0) +
    (input.elderlySupport || 0) + (input.infantCare || 0)
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

  // 6. 比例税率所得
  var dividend = input.dividend || 0
  var rentIncome = input.rent || 0
  var rentDeduction = input.rentDeduction || 0
  var transferIncome = input.transfer || 0
  var transferCost = input.transferCost || 0
  var luck = input.luck || 0

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
    comprehensiveIncome: comprehensiveIncome,
    comprehensiveDeduction: fix(basicDeduction + socialDeduction + specialTotal),
    comprehensiveTaxable: comprehensiveTaxable,
    comprehensiveTax: comprehensiveTax,
    comprehensiveBracket: comprehensiveBracket,
    businessIncome: businessIncome,
    businessTax: businessTax,
    businessBracket: businessBracket,
    dividendTax: dividendTax,
    rentTax: rentTax,
    transferTax: transferTax,
    luckTax: luckTax,
    proportionalTax: proportionalTax,
    totalTax: totalTax,
    monthlyTax: fix(totalTax / 12)
  }
}

// 计算到手工资（含个税）
export function calcTakeHome(salary, personalSocial, monthlyTax) {
  return fix(salary - personalSocial - monthlyTax)
}

export function fmt(n) { return fix(n).toFixed(2) }
