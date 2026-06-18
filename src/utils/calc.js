// 计算引擎

function fix(n) { return Math.round(n * 100) / 100 }

// 五险计算（默认缴纳）
export function calcInsurance(salary, cfg) {
  var s = cfg.social
  var base = Math.max(s.baseMin, Math.min(s.baseMax, salary))
  var pp = fix(base * s.employeePension / 100)
  var pm = fix(base * s.employeeMedical / 100)
  var pu = fix(base * s.employeeUnemployment / 100)
  var total = fix(pp + pm + pu)
  return { base: base, pp: pp, pm: pm, pu: pu, total: total, yearTotal: fix(total * 12) }
}

// 公积金计算（可选）
export function calcFund(salary, fundBase, fundRate, cfg) {
  var s = cfg.social
  var base = fundBase ? Math.max(s.fundBaseMin, Math.min(s.fundBaseMax, fundBase)) : Math.max(s.fundBaseMin, Math.min(s.fundBaseMax, salary))
  var rate = Math.max(s.fundRateMin, Math.min(s.fundRateMax, fundRate))
  var pf = fix(base * rate / 100)
  return { base: base, rate: rate, pf: pf, yearPf: fix(pf * 12) }
}

// 灵活就业计算
export function calcFlex(base, penRate, medRate, cfg) {
  var f = cfg.flexible
  var b = Math.max(f.baseMin, Math.min(f.baseMax, base))
  var p = fix(b * penRate / 100)
  var m = fix(b * medRate / 100)
  return { p: p, m: m, t: fix(p + m) }
}

// 个税计算
export function calcTax(input, cfg) {
  var salary = input.salary || 0
  var labor = input.labor || 0
  var author = input.author || 0
  var royalty = input.royalty || 0
  var business = input.business || 0
  var dividend = input.dividend || 0
  var rent = input.rent || 0
  var rentDeduction = input.rentDeduction || 0
  var transfer = input.transfer || 0
  var transferCost = input.transferCost || 0
  var luck = input.luck || 0
  var social = input.social || 0
  var special = input.special || 0

  var t = cfg.tax

  // 综合所得
  var laborTax = fix(labor * 0.8)
  var authorTax = fix(author * 0.8 * 0.7)
  var royaltyTax = fix(royalty * 0.8)
  var comprehensiveIncome = fix(salary + laborTax + authorTax + royaltyTax)

  // 应纳税所得额
  var comprehensiveTaxable = Math.max(0, fix(comprehensiveIncome - t.basicDeduction - social - special))

  // 综合所得税
  var comprehensiveTax = 0
  var comprehensiveBracket = ''
  for (var i = 0; i < t.brackets.length; i++) {
    var b = t.brackets[i]
    if (b.max === null || comprehensiveTaxable <= b.max) {
      comprehensiveTax = fix(comprehensiveTaxable * b.rate / 100 - b.deduction)
      comprehensiveBracket = b.rate + '%'
      break
    }
  }

  // 经营所得税
  var businessTax = 0
  for (var i = 0; i < t.businessBrackets.length; i++) {
    var b = t.businessBrackets[i]
    if (b.max === null || business <= b.max) {
      businessTax = fix(business * b.rate / 100 - b.deduction)
      break
    }
  }

  // 比例税率
  var dividendTax = fix(dividend * 0.2)
  var rentTax = fix(Math.max(0, rent - rentDeduction) * 0.2)
  var transferTax = fix(Math.max(0, transfer - transferCost) * 0.2)
  var luckTax = fix(luck * 0.2)
  var proportionalTax = fix(dividendTax + rentTax + transferTax + luckTax)

  var totalTax = fix(comprehensiveTax + businessTax + proportionalTax)

  return {
    comprehensiveIncome: comprehensiveIncome,
    comprehensiveDeduction: fix(t.basicDeduction + social + special),
    comprehensiveTaxable: comprehensiveTaxable,
    comprehensiveTax: comprehensiveTax,
    comprehensiveBracket: comprehensiveBracket,
    businessTax: businessTax,
    proportionalTax: proportionalTax,
    totalTax: totalTax,
    monthlyTax: fix(totalTax / 12)
  }
}

export function fmt(n) { return fix(n).toFixed(2) }
