<template>
  <view class="page">
    <view class="tabs">
      <view @click="switchTab(0)"><text :class="tab===0?'tab on':'tab'">社保缴费</text></view>
      <view @click="switchTab(1)"><text :class="tab===1?'tab on':'tab'">个人所得税</text></view>
    </view>

    <!-- 社保页 -->
    <view v-show="tab===0" class="body">
      <view class="subs">
        <view @click="switchSub(0)"><text :class="sub===0?'sub on':'sub'">企业职工</text></view>
        <view @click="switchSub(1)"><text :class="sub===1?'sub on':'sub'">灵活就业</text></view>
      </view>

      <!-- 企业职工 -->
      <view v-show="sub===0">
        <view class="card">
          <text class="title">输入参数</text>
          <view class="row"><text class="lbl">税前工资</text><input class="ipt" type="digit" :value="salary" @input="onSalaryInput"/><text class="ut">元/月</text></view>

          <view class="check-row" @click="toggleFund">
            <view class="checkbox">
              <text v-if="hasFund" class="checked">✓</text>
            </view>
            <text class="check-label">缴纳公积金</text>
          </view>

          <view v-if="hasFund">
            <view class="row"><text class="lbl">公积金基数</text><input class="ipt" type="digit" :value="fundBase" @input="onFundBaseInput" placeholder="默认等于工资"/><text class="ut">元</text></view>
            <view class="row"><text class="lbl">公积金比例</text><input class="ipt" type="digit" :value="fundRate" @input="onFundRateInput"/><text class="ut">%</text></view>
            <view class="info"><text>💡 公积金基数范围：{{cfg.social.fundBaseMin}} ~ {{cfg.social.fundBaseMax}} 元</text></view>
          </view>
        </view>

        <view class="card">
          <text class="title">📖 政策说明</text>
          <view class="know"><text class="kt">社保缴费规则</text><text class="kc">五险（养老、医疗、失业、工伤）由单位和个人共同缴纳：\n• 养老保险：单位14%，个人8%\n• 医疗保险：单位7%，个人2%\n• 失业保险：单位0.3%，个人0.5%\n• 工伤保险：单位0.2%，个人不缴</text></view>
          <view v-if="hasFund" class="know"><text class="kt">公积金规则</text><text class="kc">• 公积金基数 = 职工上一年度月平均工资\n• 基数下限: {{cfg.social.fundBaseMin}} 元（最低工资）\n• 基数上限: {{cfg.social.fundBaseMax}} 元（社平工资3倍）\n• 比例范围: 5% ~ 12%</text></view>
        </view>

        <view v-if="showResult" class="card">
          <text class="title">计算结果</text>
          <view class="big">
            <view class="bi"><text class="bl">到手工资</text><text class="bv">{{result.takeHome}}</text></view>
            <view class="bi"><text class="bl">个人扣除</text><text class="bv red">{{result.pt}}</text></view>
          </view>

          <text class="st">📝 详细计算过程</text>

          <!-- 五险明细（默认显示） -->
          <view class="det">
            <text class="dh">【五险扣除】</text>
            <view class="det-row">
              <text class="det-lbl">养老保险</text>
              <text class="det-val">{{result.base}} × 8% = {{result.pp}} 元</text>
            </view>
            <view class="det-row">
              <text class="det-lbl">医疗保险</text>
              <text class="det-val">{{result.base}} × 2% = {{result.pm}} 元</text>
            </view>
            <view class="det-row">
              <text class="det-lbl">失业保险</text>
              <text class="det-val">{{result.base}} × 0.5% = {{result.pu}} 元</text>
            </view>
            <view class="det-row total">
              <text class="det-lbl">五险合计</text>
              <text class="det-val">{{result.insuranceTotal}} 元</text>
            </view>
          </view>

          <!-- 公积金明细（勾选后显示） -->
          <view v-if="hasFund" class="det">
            <text class="dh">【公积金扣除】</text>
            <view class="det-row">
              <text class="det-lbl">公积金</text>
              <text class="det-val">{{result.fb}} × {{fundRate || cfg.social.fundRateMin}}% = {{result.pf}} 元</text>
            </view>
          </view>

          <!-- 汇总 -->
          <view class="det">
            <text class="dh">【到手工资】</text>
            <view class="det-row">
              <text class="det-lbl">税前工资</text>
              <text class="det-val">{{result.salary}} 元</text>
            </view>
            <view class="det-row">
              <text class="det-lbl">个人扣除</text>
              <text class="det-val">-{{result.pt}} 元</text>
            </view>
            <view class="det-row total">
              <text class="det-lbl">到手工资</text>
              <text class="det-val hl">{{result.takeHome}} 元</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 灵活就业 -->
      <view v-show="sub===1">
        <view class="card">
          <text class="title">灵活就业社保</text>
          <view class="row"><text class="lbl">缴费基数</text><input class="ipt" type="digit" :value="flexBase" @input="onFlexBaseInput"/><text class="ut">元</text></view>
          <view class="row"><text class="lbl">养老比例</text><input class="ipt" type="digit" :value="flexPen" @input="onFlexPenInput"/><text class="ut">%</text></view>
          <view class="row"><text class="lbl">医保比例</text><input class="ipt" type="digit" :value="flexMed" @input="onFlexMedInput"/><text class="ut">%</text></view>
        </view>

        <view class="card">
          <text class="title">📖 灵活就业说明</text>
          <view class="know"><text class="kt">缴费规则</text><text class="kc">灵活就业人员社保缴费：\n• 缴费基数：当地社平工资的60%~300%\n• 养老保险：一般20%（8%个人账户，12%统筹）\n• 医疗保险：各地不同，一般8%~12%</text></view>
        </view>

        <view v-if="showFlexResult" class="card">
          <text class="title">灵活就业缴费结果</text>
          <view class="big"><view class="bi"><text class="bl">当月应缴</text><text class="bv">{{flexResult.total}}</text></view></view>
          <view class="lst">
            <view class="li"><text>养老保险</text><text>{{flexResult.p}}</text></view>
            <view class="li"><text>医疗保险</text><text>{{flexResult.m}}</text></view>
          </view>
        </view>
      </view>
    </view>

    <!-- 个税页 -->
    <view v-show="tab===1" class="body">
      <view class="card">
        <text class="title">综合所得（元/月）</text>
        <view class="row"><text class="lbl">工资薪金</text><input class="ipt" type="digit" :value="tSalary" @input="onTSalaryInput"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">劳务报酬</text><input class="ipt" type="digit" :value="tLabor" @input="onTLaborInput"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">稿酬所得</text><input class="ipt" type="digit" :value="tAuthor" @input="onTAuthorInput"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">特许权使用费</text><input class="ipt" type="digit" :value="tRoyalty" @input="onTRoyaltyInput"/><text class="ut">元</text></view>
      </view>

      <view class="card">
        <text class="title">其他所得（元/年）</text>
        <view class="row"><text class="lbl">经营所得</text><input class="ipt" type="digit" :value="tBusiness" @input="onTBusinessInput"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">利息股息红利</text><input class="ipt" type="digit" :value="tDividend" @input="onTDividendInput"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">财产租赁</text><input class="ipt" type="digit" :value="tRent" @input="onTRentInput"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">财产转让</text><input class="ipt" type="digit" :value="tTransfer" @input="onTTransferInput"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">偶然所得</text><input class="ipt" type="digit" :value="tLuck" @input="onTLuckInput"/><text class="ut">元</text></view>
      </view>

      <view class="card">
        <text class="title">扣除项目</text>
        <view class="row"><text class="lbl">个人社保/年</text><text class="val">{{yearSocial}} 元</text><text class="sync">自动同步</text></view>
        <view class="row"><text class="lbl">子女教育/月</text><input class="ipt" type="digit" :value="tChild" @input="onTChildInput"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">继续教育/月</text><input class="ipt" type="digit" :value="tEdu" @input="onTEduInput"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">住房贷款/月</text><input class="ipt" type="digit" :value="tLoan" @input="onTLoanInput"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">住房租金/月</text><input class="ipt" type="digit" :value="tRentDeduction" @input="onTRentDeductionInput"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">赡养老人/月</text><input class="ipt" type="digit" :value="tElder" @input="onTElderInput"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">婴幼儿照护/月</text><input class="ipt" type="digit" :value="tBaby" @input="onTBabyInput"/><text class="ut">元</text></view>
      </view>

      <view class="card">
        <text class="title">📖 计算流程</text>
        <view class="proc"><text>① 综合所得 = 工资 + 劳务×80% + 稿酬×80%×70% + 特许权×80%\n② 应纳税所得额 = 综合所得 - 60,000 - 个人社保 - 专项附加\n③ 查综合所得税率表\n④ 加上经营所得税\n⑤ 加上比例税率所得（20%）\n⑥ = 年度总个税</text></view>
      </view>

      <view v-if="showTaxResult" class="card">
        <text class="title">计算结果</text>
        <view class="big">
          <view class="bi"><text class="bl">年度总个税</text><text class="bv">{{taxResult.totalTax}}</text></view>
          <view class="bi"><text class="bl">月均个税</text><text class="bv red">{{taxResult.monthlyTax}}</text></view>
        </view>

        <view class="det">
          <text class="dh">【综合所得】</text>
          <view class="det-row"><text class="det-lbl">工资薪金</text><text class="det-val">{{fmt(tSalary * 12)}} 元/年</text></view>
          <view class="det-row"><text class="det-lbl">劳务报酬</text><text class="det-val">{{fmt(tLabor * 12 * 0.8)}} 元 (×80%)</text></view>
          <view class="det-row"><text class="det-lbl">稿酬所得</text><text class="det-val">{{fmt(tAuthor * 12 * 0.8 * 0.7)}} 元 (×80%×70%)</text></view>
          <view class="det-row"><text class="det-lbl">特许权使用费</text><text class="det-val">{{fmt(tRoyalty * 12 * 0.8)}} 元 (×80%)</text></view>
          <view class="det-row total"><text class="det-lbl">综合所得合计</text><text class="det-val">{{taxResult.comprehensiveIncome}} 元</text></view>
        </view>

        <view class="det">
          <text class="dh">【扣除项目】</text>
          <view class="det-row"><text class="det-lbl">基本减除</text><text class="det-val">60,000 元</text></view>
          <view class="det-row"><text class="det-lbl">个人社保</text><text class="det-val">{{yearSocial}} 元（自动同步）</text></view>
          <view class="det-row total"><text class="det-lbl">扣除合计</text><text class="det-val">{{taxResult.comprehensiveDeduction}} 元</text></view>
        </view>

        <view class="det">
          <text class="dh">【综合所得税】</text>
          <view class="det-row"><text class="det-lbl">应纳税所得额</text><text class="det-val">{{taxResult.comprehensiveIncome}} - {{taxResult.comprehensiveDeduction}} = {{taxResult.taxableIncome}} 元</text></view>
          <view class="det-row total"><text class="det-lbl">综合所得税</text><text class="det-val hl">{{taxResult.comprehensiveTax}} 元 ({{taxResult.comprehensiveBracket}})</text></view>
        </view>

        <view class="det">
          <text class="dh">【最终结果】</text>
          <view class="det-row total"><text class="det-lbl">年度总个税</text><text class="det-val hl">{{taxResult.totalTax}} 元</text></view>
        </view>
      </view>

      <view class="card">
        <text class="title">📖 政策参考</text>
        <view class="know">
          <text class="kt">🏷️ 综合所得税率表</text>
          <view class="tbl">
            <view class="tr hd"><text class="td w1">级数</text><text class="td w2">应纳税所得额</text><text class="td w3">税率</text><text class="td w4">速算扣除</text></view>
            <view class="tr"><text class="td w1">1</text><text class="td w2">≤36,000</text><text class="td w3">3%</text><text class="td w4">0</text></view>
            <view class="tr"><text class="td w1">2</text><text class="td w2">36,000~144,000</text><text class="td w3">10%</text><text class="td w4">2,520</text></view>
            <view class="tr"><text class="td w1">3</text><text class="td w2">144,000~300,000</text><text class="td w3">20%</text><text class="td w4">16,920</text></view>
            <view class="tr"><text class="td w1">4</text><text class="td w2">300,000~420,000</text><text class="td w3">25%</text><text class="td w4">31,920</text></view>
            <view class="tr"><text class="td w1">5</text><text class="td w2">420,000~660,000</text><text class="td w3">30%</text><text class="td w4">52,920</text></view>
            <view class="tr"><text class="td w1">6</text><text class="td w2">660,000~960,000</text><text class="td w3">35%</text><text class="td w4">85,920</text></view>
            <view class="tr"><text class="td w1">7</text><text class="td w2">>960,000</text><text class="td w4">45%</text><text class="td w4">181,920</text></view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { loadConfig, loadInput, saveInput } from '../../utils/store'
import { calcSocial, calcFlex, calcTax, calcTakeHome, fmt } from '../../utils/calc'

export default {
  data: function() {
    return {
      tab: 0,
      sub: 0,
      cfg: null,
      hasFund: false,
      salary: '',
      fundBase: '',
      fundRate: '',
      flexBase: '',
      flexPen: '',
      flexMed: '',
      tSalary: '',
      tLabor: '',
      tAuthor: '',
      tRoyalty: '',
      tBusiness: '',
      tDividend: '',
      tRent: '',
      tTransfer: '',
      tLuck: '',
      yearSocial: '0',
      tChild: '',
      tEdu: '',
      tLoan: '',
      tRentDeduction: '',
      tElder: '',
      tBaby: '',
      showResult: false,
      showFlexResult: false,
      showTaxResult: false,
      result: {
        salary: '0', base: '0', fb: '0',
        ep: '0', em: '0', eu: '0', ei: '0', ef: '0', et: '0',
        pp: '0', pm: '0', pu: '0', pf: '0', pt: '0',
        insuranceTotal: '0', fundTotal: '0',
        yearPt: '0', takeHome: '0', monthlyTax: '0'
      },
      flexResult: { total: '0', p: '0', m: '0' },
      taxResult: {
        totalTax: '0', monthlyTax: '0', comprehensiveIncome: '0',
        comprehensiveDeduction: '0', taxableIncome: '0', comprehensiveTax: '0',
        comprehensiveBracket: '', businessTax: '0', proportionalTax: '0'
      }
    }
  },
  watch: {
    hasFund: function() { this.doCalc() },
    salary: function() { this.doCalc() },
    fundBase: function() { this.doCalc() },
    fundRate: function() { this.doCalc() },
    flexBase: function() { this.doCalcFlex() },
    flexPen: function() { this.doCalcFlex() },
    flexMed: function() { this.doCalcFlex() },
    tSalary: function() { this.doCalcTax() },
    tLabor: function() { this.doCalcTax() },
    tAuthor: function() { this.doCalcTax() },
    tRoyalty: function() { this.doCalcTax() },
    tBusiness: function() { this.doCalcTax() },
    tDividend: function() { this.doCalcTax() },
    tRent: function() { this.doCalcTax() },
    tTransfer: function() { this.doCalcTax() },
    tLuck: function() { this.doCalcTax() },
    tChild: function() { this.doCalcTax() },
    tEdu: function() { this.doCalcTax() },
    tLoan: function() { this.doCalcTax() },
    tRentDeduction: function() { this.doCalcTax() },
    tElder: function() { this.doCalcTax() },
    tBaby: function() { this.doCalcTax() }
  },
  onLoad: function() {
    this.cfg = loadConfig()
    this.loadData()
    this.doCalc()
    this.doCalcFlex()
    this.doCalcTax()
  },
  onShow: function() {
    this.cfg = loadConfig()
    this.loadData()
    this.doCalc()
    this.doCalcFlex()
    this.doCalcTax()
  },
  methods: {
    fmt: fmt,
    loadData: function() {
      var inp = loadInput()
      this.hasFund = inp.hasFund === 'true'
      this.salary = inp.salary || ''
      this.fundBase = inp.fundBase || ''
      this.fundRate = inp.fundRate || ''
      this.flexBase = inp.flexBase || ''
      this.flexPen = inp.flexPen || ''
      this.flexMed = inp.flexMed || ''
      this.tSalary = inp.tSalary || ''
      this.tLabor = inp.tLabor || ''
      this.tAuthor = inp.tAuthor || ''
      this.tRoyalty = inp.tRoyalty || ''
      this.tBusiness = inp.tBusiness || ''
      this.tDividend = inp.tDividend || ''
      this.tRent = inp.tRent || ''
      this.tTransfer = inp.tTransfer || ''
      this.tLuck = inp.tLuck || ''
      this.tChild = inp.tChild || ''
      this.tEdu = inp.tEdu || ''
      this.tLoan = inp.tLoan || ''
      this.tRentDeduction = inp.tRentDeduction || ''
      this.tElder = inp.tElder || ''
      this.tBaby = inp.tBaby || ''
    },
    switchTab: function(index) {
      this.tab = index
    },
    switchSub: function(index) {
      this.sub = index
    },
    toggleFund: function() {
      console.log('toggleFund', this.hasFund, '->', !this.hasFund)
      this.hasFund = !this.hasFund
      this.doCalc()
      this.save()
    },
    onSalaryInput: function(e) {
      this.salary = e.detail.value
      this.tSalary = e.detail.value
      this.doCalc()
      this.doCalcTax()
      this.save()
    },
    onFundBaseInput: function(e) { this.fundBase = e.detail.value; this.doCalc(); this.save() },
    onFundRateInput: function(e) { this.fundRate = e.detail.value; this.doCalc(); this.save() },
    onFlexBaseInput: function(e) { this.flexBase = e.detail.value; this.doCalcFlex(); this.save() },
    onFlexPenInput: function(e) { this.flexPen = e.detail.value; this.doCalcFlex(); this.save() },
    onFlexMedInput: function(e) { this.flexMed = e.detail.value; this.doCalcFlex(); this.save() },
    onTSalaryInput: function(e) { this.tSalary = e.detail.value; this.salary = e.detail.value; this.doCalc(); this.doCalcTax(); this.save() },
    onTLaborInput: function(e) { this.tLabor = e.detail.value; this.doCalcTax(); this.save() },
    onTAuthorInput: function(e) { this.tAuthor = e.detail.value; this.doCalcTax(); this.save() },
    onTRoyaltyInput: function(e) { this.tRoyalty = e.detail.value; this.doCalcTax(); this.save() },
    onTBusinessInput: function(e) { this.tBusiness = e.detail.value; this.doCalcTax(); this.save() },
    onTDividendInput: function(e) { this.tDividend = e.detail.value; this.doCalcTax(); this.save() },
    onTRentInput: function(e) { this.tRent = e.detail.value; this.doCalcTax(); this.save() },
    onTTransferInput: function(e) { this.tTransfer = e.detail.value; this.doCalcTax(); this.save() },
    onTLuckInput: function(e) { this.tLuck = e.detail.value; this.doCalcTax(); this.save() },
    onTChildInput: function(e) { this.tChild = e.detail.value; this.doCalcTax(); this.save() },
    onTEduInput: function(e) { this.tEdu = e.detail.value; this.doCalcTax(); this.save() },
    onTLoanInput: function(e) { this.tLoan = e.detail.value; this.doCalcTax(); this.save() },
    onTRentDeductionInput: function(e) { this.tRentDeduction = e.detail.value; this.doCalcTax(); this.save() },
    onTElderInput: function(e) { this.tElder = e.detail.value; this.doCalcTax(); this.save() },
    onTBabyInput: function(e) { this.tBaby = e.detail.value; this.doCalcTax(); this.save() },
    doCalc: function() {
      if (!this.cfg) return
      var s = parseFloat(this.salary) || 0
      var cfg = this.cfg.social

      // 五险默认计算
      var base = Math.max(cfg.baseMin, Math.min(cfg.baseMax, s))
      var pp = fix(base * cfg.employeePension / 100)
      var pm = fix(base * cfg.employeeMedical / 100)
      var pu = fix(base * cfg.employeeUnemployment / 100)
      var insuranceTotal = fix(pp + pm + pu)

      // 公积金可选
      var pf = 0
      var fb = 0
      if (this.hasFund) {
        fb = parseFloat(this.fundBase) || s
        fb = Math.max(cfg.fundBaseMin, Math.min(cfg.fundBaseMax, fb))
        var fr = parseFloat(this.fundRate) || cfg.fundRateMin
        fr = Math.max(cfg.fundRateMin, Math.min(cfg.fundRateMax, fr))
        pf = fix(fb * fr / 100)
      }

      var pt = fix(insuranceTotal + pf)
      var monthlyTax = 0

      // 计算个税（用于到手工资）
      if (s > 0) {
        var tax = calcTax({
          salary: s * 12, labor: 0, author: 0, royalty: 0,
          business: 0, dividend: 0, rent: 0, rentDeduction: 0,
          transfer: 0, transferCost: 0, luck: 0, social: fix(pt * 12),
          childEducation: 0, continuingEducation: 0, housingLoan: 0,
          housingRent: 0, elderlySupport: 0, infantCare: 0
        }, this.cfg)
        monthlyTax = tax.monthlyTax
      }

      this.yearSocial = fmt(fix(pt * 12))
      this.result = {
        salary: fmt(s),
        base: fmt(base),
        fb: fmt(fb),
        ep: fmt(fix(base * cfg.employerPension / 100)),
        em: fmt(fix(base * cfg.employerMedical / 100)),
        eu: fmt(fix(base * cfg.employerUnemployment / 100)),
        ei: fmt(fix(base * cfg.employerInjury / 100)),
        ef: fmt(fix(fb * (this.hasFund ? parseFloat(this.fundRate) || cfg.fundRateMin : 0) / 100)),
        et: fmt(fix(base * cfg.employerPension / 100 + base * cfg.employerMedical / 100 + base * cfg.employerUnemployment / 100 + base * cfg.employerInjury / 100)),
        pp: fmt(pp),
        pm: fmt(pm),
        pu: fmt(pu),
        pf: fmt(pf),
        pt: fmt(pt),
        insuranceTotal: fmt(insuranceTotal),
        fundTotal: fmt(pf),
        yearPt: fmt(fix(pt * 12)),
        takeHome: fmt(fix(s - pt - monthlyTax)),
        monthlyTax: fmt(monthlyTax)
      }
      this.showResult = true
    },
    doCalcFlex: function() {
      if (!this.cfg) return
      var base = parseFloat(this.flexBase) || 0
      var pen = parseFloat(this.flexPen) || this.cfg.flexible.pensionRate
      var med = parseFloat(this.flexMed) || this.cfg.flexible.medicalRate
      var res = calcFlex(base, pen, med, this.cfg)
      this.flexResult = { total: fmt(res.t), p: fmt(res.p), m: fmt(res.m) }
      this.showFlexResult = true
    },
    doCalcTax: function() {
      if (!this.cfg) return
      var s = parseFloat(this.tSalary) || 0
      var ys = parseFloat(this.yearSocial) || 0
      var tax = calcTax({
        salary: s * 12, labor: (parseFloat(this.tLabor) || 0) * 12,
        author: (parseFloat(this.tAuthor) || 0) * 12, royalty: (parseFloat(this.tRoyalty) || 0) * 12,
        business: parseFloat(this.tBusiness) || 0, dividend: parseFloat(this.tDividend) || 0,
        rent: parseFloat(this.tRent) || 0, rentDeduction: 0,
        transfer: parseFloat(this.tTransfer) || 0, transferCost: 0,
        luck: parseFloat(this.tLuck) || 0, social: ys,
        childEducation: (parseFloat(this.tChild) || 0) * 12, continuingEducation: (parseFloat(this.tEdu) || 0) * 12,
        housingLoan: (parseFloat(this.tLoan) || 0) * 12, housingRent: (parseFloat(this.tRentDeduction) || 0) * 12,
        elderlySupport: (parseFloat(this.tElder) || 0) * 12, infantCare: (parseFloat(this.tBaby) || 0) * 12
      }, this.cfg)
      this.taxResult = {
        totalTax: fmt(tax.totalTax), monthlyTax: fmt(tax.monthlyTax),
        comprehensiveIncome: fmt(tax.comprehensiveIncome),
        comprehensiveDeduction: fmt(tax.comprehensiveDeduction),
        taxableIncome: fmt(tax.comprehensiveTaxable),
        comprehensiveTax: fmt(tax.comprehensiveTax),
        comprehensiveBracket: tax.comprehensiveBracket,
        businessTax: fmt(tax.businessTax), proportionalTax: fmt(tax.proportionalTax)
      }
      this.showTaxResult = true
    },
    save: function() {
      saveInput({
        hasFund: String(this.hasFund),
        salary: this.salary,
        fundBase: this.fundBase,
        fundRate: this.fundRate,
        flexBase: this.flexBase,
        flexPen: this.flexPen,
        flexMed: this.flexMed,
        tSalary: this.tSalary,
        tLabor: this.tLabor,
        tAuthor: this.tAuthor,
        tRoyalty: this.tRoyalty,
        tBusiness: this.tBusiness,
        tDividend: this.tDividend,
        tRent: this.tRent,
        tTransfer: this.tTransfer,
        tLuck: this.tLuck,
        tChild: this.tChild,
        tEdu: this.tEdu,
        tLoan: this.tLoan,
        tRentDeduction: this.tRentDeduction,
        tElder: this.tElder,
        tBaby: this.tBaby
      })
    }
  }
}

function fix(n) { return Math.round(n * 100) / 100 }
</script>

<style>
.page{min-height:100vh;background:#f5f7fa;padding-bottom:30rpx}
.tabs{display:flex;background:#fff;border-bottom:2rpx solid #eee}
.tabs view{flex:1}
.tab{display:block;height:90rpx;line-height:90rpx;text-align:center;font-size:30rpx;color:#666}
.tab.on{color:#2d8cf0;font-weight:bold;border-bottom:4rpx solid #2d8cf0}
.body{padding:20rpx}
.subs{display:flex;background:#fff;padding:16rpx;border-radius:12rpx;margin-bottom:20rpx}
.subs view{flex:1}
.sub{display:block;height:72rpx;line-height:72rpx;text-align:center;font-size:28rpx;color:#666;background:#f0f2f5;border-radius:8rpx}
.sub.on{background:#e8f3ff;color:#2d8cf0;font-weight:bold}
.card{background:#fff;border-radius:16rpx;padding:24rpx;margin-bottom:20rpx}
.title{display:block;font-size:32rpx;font-weight:bold;color:#333;margin-bottom:24rpx;text-align:center}
.row{display:flex;align-items:center;margin-bottom:20rpx}
.lbl{width:180rpx;font-size:28rpx;color:#666}
.ipt{flex:1;height:80rpx;border:2rpx solid #e5e5e5;border-radius:8rpx;padding:0 16rpx;font-size:28rpx}
.ut{font-size:24rpx;color:#999;margin-left:12rpx}
.val{flex:1;font-size:28rpx;color:#2d8cf0;font-weight:bold}
.sync{font-size:22rpx;color:#999;background:#f0f0f0;padding:4rpx 12rpx;border-radius:8rpx;margin-left:12rpx}
.info{background:#fffbe6;border:2rpx solid #ffe58f;border-radius:8rpx;padding:16rpx;margin:16rpx 0;font-size:24rpx;color:#8c6e00}
.check-row{display:flex;align-items:center;margin-bottom:20rpx;cursor:pointer}
.checkbox{width:40rpx;height:40rpx;border:2rpx solid #ddd;border-radius:8rpx;display:flex;align-items:center;justify-content:center;margin-right:12rpx;background:#fff}
.checked{color:#2d8cf0;font-weight:bold}
.check-label{font-size:28rpx;color:#666}
.big{display:flex;justify-content:space-around;padding:20rpx 0;border-bottom:2rpx solid #f0f0f0;margin-bottom:20rpx}
.bi{text-align:center}
.bl{display:block;font-size:24rpx;color:#999;margin-bottom:10rpx}
.bv{font-size:44rpx;font-weight:bold;color:#2d8cf0}
.bv.red{color:#f56c6c}
.lst{padding:0 10rpx}
.li{display:flex;justify-content:space-between;padding:16rpx 0;border-bottom:1rpx solid #f5f5f5;font-size:28rpx}
.li text:first-child{color:#666}
.li text:last-child{color:#333}
.st{display:block;font-size:28rpx;font-weight:bold;color:#333;margin:20rpx 0 16rpx}
.det{background:#f8f9fa;border-radius:8rpx;padding:16rpx;margin-bottom:16rpx}
.dh{display:block;font-size:26rpx;font-weight:bold;color:#2d8cf0;margin-bottom:12rpx}
.det-row{display:flex;justify-content:space-between;padding:8rpx 0;font-size:24rpx}
.det-row.total{border-top:1rpx solid #e5e5e5;padding-top:12rpx;margin-top:8rpx}
.det-lbl{color:#666}
.det-val{color:#333}
.det-val.hl{color:#2d8cf0;font-weight:bold}
.know{background:#f0f7ff;border-radius:12rpx;padding:20rpx;margin:16rpx 0}
.kt{display:block;font-size:26rpx;font-weight:bold;color:#2d8cf0;margin-bottom:12rpx}
.kc{font-size:24rpx;color:#555;line-height:1.8}
.proc{background:#f8f9fa;border-radius:8rpx;padding:16rpx}
.proc text{font-size:24rpx;color:#555;line-height:2}
.tbl{border:1rpx solid #e5e5e5;border-radius:8rpx;overflow:hidden}
.tr{display:flex;border-bottom:1rpx solid #e5e5e5}
.tr:last-child{border-bottom:none}
.tr.hd{background:#f0f7ff}
.td{padding:12rpx;font-size:22rpx;text-align:center}
.w1{width:60rpx}
.w2{flex:1}
.w3{width:100rpx}
.w4{width:120rpx}
</style>
