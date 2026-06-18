<template>
  <view class="page">
    <view class="tabs">
      <view @click="tab=0"><text :class="tab===0?'tab on':'tab'">社保缴费</text></view>
      <view @click="tab=1"><text :class="tab===1?'tab on':'tab'">个人所得税</text></view>
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
          <view class="row"><text class="lbl">税前工资</text><input class="ipt" type="digit" v-model.number="salary"/><text class="ut">元/月</text></view>

          <view class="check-row" @click="hasSocial = !hasSocial">
            <view class="checkbox">
              <text v-if="hasSocial" class="checked">✓</text>
            </view>
            <text class="check-label">缴纳五险一金</text>
          </view>

          <view v-if="hasSocial">
            <view class="row"><text class="lbl">公积金基数</text><input class="ipt" type="digit" v-model.number="fundBase" placeholder="默认等于工资"/><text class="ut">元</text></view>
            <view class="row"><text class="lbl">公积金比例</text><input class="ipt" type="digit" v-model.number="fundRate"/><text class="ut">%</text></view>
            <view class="info"><text>💡 社保基数范围：{{cfg ? cfg.social.baseMin : 0}} ~ {{cfg ? cfg.social.baseMax : 0}} 元</text></view>
          </view>
        </view>

        <view class="card">
          <text class="title">📖 政策说明</text>
          <view class="know"><text class="kt">缴费基数规则</text><text class="kc">根据《社会保险法》第六十条：\n• 用人单位应按时足额缴纳社保费\n• 缴费基数为职工工资总额\n• 有上下限限制</text></view>
          <view v-if="hasSocial" class="know"><text class="kt">当前配置比例</text><text class="kc">单位：养老{{cfg ? cfg.social.employerPension : 0}}% 医疗{{cfg ? cfg.social.employerMedical : 0}}% 失业{{cfg ? cfg.social.employerUnemployment : 0}}% 工伤{{cfg ? cfg.social.employerInjury : 0}}%\n个人：养老{{cfg ? cfg.social.employeePension : 0}}% 医疗{{cfg ? cfg.social.employeeMedical : 0}}% 失业{{cfg ? cfg.social.employeeUnemployment : 0}}%</text></view>
        </view>

        <view v-if="showResult" class="card">
          <text class="title">计算结果</text>
          <view class="big">
            <view class="bi"><text class="bl">到手工资</text><text class="bv">{{r.takeHome}}</text></view>
            <view class="bi"><text class="bl">个人社保</text><text class="bv red">{{r.pt}}</text></view>
          </view>

          <view v-if="hasSocial">
            <text class="st">📝 详细计算过程</text>
            <view class="det">
              <text class="dh">【基数确定】</text>
              <text class="dc">输入工资: {{salary}} 元</text>
              <text class="dc">社保基数上下限: {{cfg ? cfg.social.baseMin : 0}} ~ {{cfg ? cfg.social.baseMax : 0}}</text>
              <text class="dhl">→ 实际社保基数: {{r.base}} 元</text>
              <text class="dc" v-if="fundBase">公积金基数: {{r.fb}} 元（单独设置）</text>
              <text class="dc" v-else>公积金基数: {{r.base}} 元（等于社保基数）</text>
            </view>
            <view class="det">
              <text class="dh">【单位缴费】</text>
              <text class="dc">养老 = {{r.base}} × {{cfg ? cfg.social.employerPension : 0}}% = {{r.ep}} 元</text>
              <text class="dc">医疗 = {{r.base}} × {{cfg ? cfg.social.employerMedical : 0}}% = {{r.em}} 元</text>
              <text class="dc">失业 = {{r.base}} × {{cfg ? cfg.social.employerUnemployment : 0}}% = {{r.eu}} 元</text>
              <text class="dc">工伤 = {{r.base}} × {{cfg ? cfg.social.employerInjury : 0}}% = {{r.ei}} 元</text>
              <text class="dc">公积金 = {{r.fb}} × {{fundRate}}% = {{r.ef}} 元</text>
              <text class="dhl">单位合计: {{r.et}} 元</text>
            </view>
            <view class="det">
              <text class="dh">【个人缴费】</text>
              <text class="dc">养老 = {{r.base}} × {{cfg ? cfg.social.employeePension : 0}}% = {{r.pp}} 元</text>
              <text class="dc">医疗 = {{r.base}} × {{cfg ? cfg.social.employeeMedical : 0}}% = {{r.pm}} 元</text>
              <text class="dc">失业 = {{r.base}} × {{cfg ? cfg.social.employeeUnemployment : 0}}% = {{r.pu}} 元</text>
              <text class="dc">公积金 = {{r.fb}} × {{fundRate}}% = {{r.pf}} 元</text>
              <text class="dhl">个人合计: {{r.pt}} 元/月，{{r.yearPt}} 元/年</text>
            </view>
            <view class="det">
              <text class="dh">【到手工资】</text>
              <text class="dc">税前工资: {{salary}} 元</text>
              <text class="dc">个人社保: -{{r.pt}} 元</text>
              <text class="dc">预估个税: -{{r.monthlyTax}} 元</text>
              <text class="dhl">到手工资: {{r.takeHome}} 元</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 灵活就业 -->
      <view v-show="sub===1">
        <view class="card">
          <text class="title">灵活就业社保</text>
          <view class="row"><text class="lbl">缴费基数</text><input class="ipt" type="digit" v-model.number="flexBase"/><text class="ut">元</text></view>
          <view class="row"><text class="lbl">养老比例</text><input class="ipt" type="digit" v-model.number="flexPen"/><text class="ut">%</text></view>
          <view class="row"><text class="lbl">医保比例</text><input class="ipt" type="digit" v-model.number="flexMed"/><text class="ut">%</text></view>
        </view>

        <view class="card">
          <text class="title">📖 灵活就业说明</text>
          <view class="know"><text class="kt">缴费规则</text><text class="kc">灵活就业人员社保缴费规则：\n• 缴费基数可在当地社平工资的60%~300%之间选择\n• 养老保险：一般20%（8%进入个人账户，12%进入统筹）\n• 医疗保险：各地不同，一般8%~12%\n• 失业保险：部分地区可选</text></view>
        </view>

        <view v-if="showFlexResult" class="card">
          <text class="title">灵活就业缴费结果</text>
          <view class="big"><view class="bi"><text class="bl">当月应缴</text><text class="bv">{{fr.total}}</text></view></view>
          <view class="lst"><view class="li"><text>养老保险</text><text>{{fr.p}}</text></view><view class="li"><text>医疗保险</text><text>{{fr.m}}</text></view></view>
        </view>
      </view>
    </view>

    <!-- 个税页 -->
    <view v-show="tab===1" class="body">
      <view class="card">
        <text class="title">综合所得（元/月）</text>
        <view class="row"><text class="lbl">工资薪金</text><input class="ipt" type="digit" v-model.number="tSalary"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">劳务报酬</text><input class="ipt" type="digit" v-model.number="tLabor"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">稿酬所得</text><input class="ipt" type="digit" v-model.number="tAuthor"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">特许权使用费</text><input class="ipt" type="digit" v-model.number="tRoyalty"/><text class="ut">元</text></view>
      </view>

      <view class="card">
        <text class="title">其他所得（元/年）</text>
        <view class="row"><text class="lbl">经营所得</text><input class="ipt" type="digit" v-model.number="tBusiness"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">利息股息红利</text><input class="ipt" type="digit" v-model.number="tDividend"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">财产租赁</text><input class="ipt" type="digit" v-model.number="tRent"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">财产转让</text><input class="ipt" type="digit" v-model.number="tTransfer"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">偶然所得</text><input class="ipt" type="digit" v-model.number="tLuck"/><text class="ut">元</text></view>
      </view>

      <view class="card">
        <text class="title">扣除项目</text>
        <view class="row"><text class="lbl">个人社保/年</text><text class="val">{{yearSocial}} 元</text><text class="sync">自动同步</text></view>
        <view class="row"><text class="lbl">子女教育/月</text><input class="ipt" type="digit" v-model.number="tChild"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">继续教育/月</text><input class="ipt" type="digit" v-model.number="tEdu"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">住房贷款/月</text><input class="ipt" type="digit" v-model.number="tLoan"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">住房租金/月</text><input class="ipt" type="digit" v-model.number="tRentDeduction"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">赡养老人/月</text><input class="ipt" type="digit" v-model.number="tElder"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">婴幼儿照护/月</text><input class="ipt" type="digit" v-model.number="tBaby"/><text class="ut">元</text></view>
      </view>

      <view class="card">
        <text class="title">📖 计算流程</text>
        <view class="proc"><text>① 综合所得 = 工资 + 劳务×80% + 稿酬×80%×70% + 特许权×80%\n② 应纳税所得额 = 综合所得 - 60,000 - 个人社保 - 专项附加\n③ 查综合所得税率表\n④ 加上经营所得税\n⑤ 加上比例税率所得（20%）\n⑥ = 年度总个税</text></view>
      </view>

      <view v-if="showTaxResult" class="card">
        <text class="title">计算结果</text>
        <view class="big">
          <view class="bi"><text class="bl">年度总个税</text><text class="bv">{{tr.totalTax}}</text></view>
          <view class="bi"><text class="bl">月均个税</text><text class="bv red">{{tr.monthlyTax}}</text></view>
        </view>

        <view class="det">
          <text class="dh">【综合所得】</text>
          <text class="dc">工资薪金: {{fmt(tSalary * 12)}} 元/年</text>
          <text class="dc">劳务报酬: {{fmt(tLabor * 12 * 0.8)}} 元 (×80%)</text>
          <text class="dc">稿酬所得: {{fmt(tAuthor * 12 * 0.8 * 0.7)}} 元 (×80%×70%)</text>
          <text class="dc">特许权使用费: {{fmt(tRoyalty * 12 * 0.8)}} 元 (×80%)</text>
          <text class="dhl">综合所得合计: {{tr.comprehensiveIncome}} 元</text>
        </view>

        <view class="det">
          <text class="dh">【扣除项目】</text>
          <text class="dc">基本减除: 60,000 元</text>
          <text class="dc">个人社保: {{yearSocial}} 元（自动同步）</text>
          <text class="dhl">扣除合计: {{tr.comprehensiveDeduction}} 元</text>
        </view>

        <view class="det">
          <text class="dh">【综合所得税】</text>
          <text class="dc">应纳税所得额 = {{tr.comprehensiveIncome}} - {{tr.comprehensiveDeduction}} = {{tr.taxableIncome}} 元</text>
          <text class="dhl">综合所得税: {{tr.comprehensiveTax}} 元 (税率{{tr.comprehensiveBracket}})</text>
        </view>

        <view class="det">
          <text class="dh">【最终结果】</text>
          <text class="dhl">年度总个税 = {{tr.comprehensiveTax}} + {{tr.businessTax}} + {{tr.proportionalTax}} = {{tr.totalTax}} 元</text>
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
  data() {
    return {
      tab: 0, sub: 0, cfg: null,
      hasSocial: false,
      salary: 10000, fundBase: null, fundRate: 5,
      flexBase: 4986, flexPen: 20, flexMed: 8,
      tSalary: 10000, tLabor: 0, tAuthor: 0, tRoyalty: 0,
      tBusiness: 0, tDividend: 0, tRent: 0, tTransfer: 0, tLuck: 0,
      yearSocial: '0', tChild: 0, tEdu: 0, tLoan: 0,
      tRentDeduction: 0, tElder: 0, tBaby: 0,
      showResult: false, showFlexResult: false, showTaxResult: false,
      r: { base: '0', fb: '0', ep: '0', em: '0', eu: '0', ei: '0', ef: '0', et: '0', pp: '0', pm: '0', pu: '0', pf: '0', pt: '0', yearPt: '0', takeHome: '0', monthlyTax: '0' },
      fr: { total: '0', p: '0', m: '0' },
      tr: { totalTax: '0', monthlyTax: '0', comprehensiveIncome: '0', comprehensiveDeduction: '0', taxableIncome: '0', comprehensiveTax: '0', comprehensiveBracket: '', businessTax: '0', proportionalTax: '0' }
    }
  },
  watch: {
    hasSocial() { this.doCalc() },
    salary() { this.doCalc() },
    fundBase() { this.doCalc() },
    fundRate() { this.doCalc() },
    flexBase() { this.doCalcFlex() },
    flexPen() { this.doCalcFlex() },
    flexMed() { this.doCalcFlex() },
    tSalary() { this.doCalcTax() },
    tLabor() { this.doCalcTax() },
    tAuthor() { this.doCalcTax() },
    tRoyalty() { this.doCalcTax() },
    tBusiness() { this.doCalcTax() },
    tDividend() { this.doCalcTax() },
    tRent() { this.doCalcTax() },
    tTransfer() { this.doCalcTax() },
    tLuck() { this.doCalcTax() },
    tChild() { this.doCalcTax() },
    tEdu() { this.doCalcTax() },
    tLoan() { this.doCalcTax() },
    tRentDeduction() { this.doCalcTax() },
    tElder() { this.doCalcTax() },
    tBaby() { this.doCalcTax() }
  },
  onLoad() {
    this.cfg = loadConfig()
    this.loadInputData()
    this.doCalc()
    this.doCalcFlex()
    this.doCalcTax()
  },
  onShow() {
    this.cfg = loadConfig()
    this.loadInputData()
    this.doCalc()
    this.doCalcFlex()
    this.doCalcTax()
  },
  methods: {
    fmt: fmt,
    loadInputData() {
      var inp = loadInput()
      this.hasSocial = inp.hasSocial === 'true'
      this.salary = parseFloat(inp.salary) || 10000
      this.tSalary = parseFloat(inp.tSalary) || 10000
      this.fundRate = parseFloat(inp.fundRate) || 5
      this.fundBase = inp.fundBase ? parseFloat(inp.fundBase) : null
      this.flexBase = parseFloat(inp.flexBase) || 4986
      this.flexPen = parseFloat(inp.flexPen) || 20
      this.flexMed = parseFloat(inp.flexMed) || 8
      this.tLabor = parseFloat(inp.tLabor) || 0
      this.tAuthor = parseFloat(inp.tAuthor) || 0
      this.tRoyalty = parseFloat(inp.tRoyalty) || 0
      this.tBusiness = parseFloat(inp.tBusiness) || 0
      this.tDividend = parseFloat(inp.tDividend) || 0
      this.tRent = parseFloat(inp.tRent) || 0
      this.tTransfer = parseFloat(inp.tTransfer) || 0
      this.tLuck = parseFloat(inp.tLuck) || 0
      this.tChild = parseFloat(inp.tChild) || 0
      this.tEdu = parseFloat(inp.tEdu) || 0
      this.tLoan = parseFloat(inp.tLoan) || 0
      this.tRentDeduction = parseFloat(inp.tRentDeduction) || 0
      this.tElder = parseFloat(inp.tElder) || 0
      this.tBaby = parseFloat(inp.tBaby) || 0
    },
    switchSub(index) {
      this.sub = index
    },
    doCalc() {
      if (!this.cfg) return
      var s = this.salary || 0

      if (this.hasSocial) {
        var fb = (this.fundBase !== null && this.fundBase !== undefined && this.fundBase !== '')
                  ? this.fundBase : s
        var fr = this.fundRate || 5
        var social = calcSocial(s, fb, fr, this.cfg)
        this.yearSocial = fmt(social.yearPt)
        var tax = calcTax({
          salary: (this.tSalary || 0) * 12,
          labor: (this.tLabor || 0) * 12,
          author: (this.tAuthor || 0) * 12,
          royalty: (this.tRoyalty || 0) * 12,
          business: this.tBusiness || 0,
          dividend: this.tDividend || 0,
          rent: this.tRent || 0,
          rentDeduction: 0,
          transfer: this.tTransfer || 0,
          transferCost: 0,
          luck: this.tLuck || 0,
          social: social.yearPt,
          childEducation: (this.tChild || 0) * 12,
          continuingEducation: (this.tEdu || 0) * 12,
          housingLoan: (this.tLoan || 0) * 12,
          housingRent: (this.tRentDeduction || 0) * 12,
          elderlySupport: (this.tElder || 0) * 12,
          infantCare: (this.tBaby || 0) * 12
        }, this.cfg)
        this.r = {
          base: fmt(social.base), fb: fmt(social.fundBase),
          ep: fmt(social.ep), em: fmt(social.em), eu: fmt(social.eu), ei: fmt(social.ei), ef: fmt(social.ef), et: fmt(social.et),
          pp: fmt(social.pp), pm: fmt(social.pm), pu: fmt(social.pu), pf: fmt(social.pf), pt: fmt(social.pt),
          yearPt: fmt(social.yearPt), takeHome: fmt(calcTakeHome(s, social.pt, tax.monthlyTax)),
          monthlyTax: fmt(tax.monthlyTax)
        }
      } else {
        this.yearSocial = '0'
        this.r = {
          base: '0', fb: '0', ep: '0', em: '0', eu: '0', ei: '0', ef: '0', et: '0',
          pp: '0', pm: '0', pu: '0', pf: '0', pt: '0', yearPt: '0',
          takeHome: fmt(s), monthlyTax: '0'
        }
      }
      this.showResult = true
      this.save()
    },
    doCalcFlex() {
      if (!this.cfg) return
      var res = calcFlex(this.flexBase || 0, this.flexPen || 20, this.flexMed || 8, this.cfg)
      this.fr = { total: fmt(res.t), p: fmt(res.p), m: fmt(res.m) }
      this.showFlexResult = true
    },
    doCalcTax() {
      if (!this.cfg) return
      var s = this.tSalary || 0
      var ys = parseFloat(this.yearSocial) || 0
      var tax = calcTax({
        salary: s * 12, labor: (this.tLabor || 0) * 12,
        author: (this.tAuthor || 0) * 12, royalty: (this.tRoyalty || 0) * 12,
        business: this.tBusiness || 0, dividend: this.tDividend || 0,
        rent: this.tRent || 0, rentDeduction: 0,
        transfer: this.tTransfer || 0, transferCost: 0,
        luck: this.tLuck || 0, social: ys,
        childEducation: (this.tChild || 0) * 12, continuingEducation: (this.tEdu || 0) * 12,
        housingLoan: (this.tLoan || 0) * 12, housingRent: (this.tRentDeduction || 0) * 12,
        elderlySupport: (this.tElder || 0) * 12, infantCare: (this.tBaby || 0) * 12
      }, this.cfg)
      this.tr = {
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
    save() {
      saveInput({
        hasSocial: String(this.hasSocial),
        salary: String(this.salary),
        fundBase: this.fundBase !== null ? String(this.fundBase) : '',
        fundRate: String(this.fundRate),
        flexBase: String(this.flexBase), flexPen: String(this.flexPen), flexMed: String(this.flexMed),
        tSalary: String(this.tSalary), tLabor: String(this.tLabor), tAuthor: String(this.tAuthor), tRoyalty: String(this.tRoyalty),
        tBusiness: String(this.tBusiness), tDividend: String(this.tDividend), tRent: String(this.tRent),
        tTransfer: String(this.tTransfer), tLuck: String(this.tLuck),
        tChild: String(this.tChild), tEdu: String(this.tEdu), tLoan: String(this.tLoan),
        tRentDeduction: String(this.tRentDeduction), tElder: String(this.tElder), tBaby: String(this.tBaby)
      })
    }
  }
}
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
.title{display:block;font-size:30rpx;font-weight:bold;color:#333;margin-bottom:20rpx}
.row{display:flex;align-items:center;margin-bottom:20rpx}
.lbl{width:180rpx;font-size:28rpx;color:#666}
.ipt{flex:1;height:80rpx;border:2rpx solid #e5e5e5;border-radius:8rpx;padding:0 16rpx;font-size:28rpx}
.ut{font-size:24rpx;color:#999;margin-left:12rpx}
.val{flex:1;font-size:28rpx;color:#2d8cf0;font-weight:bold}
.sync{font-size:22rpx;color:#999;background:#f0f0f0;padding:4rpx 12rpx;border-radius:8rpx;margin-left:12rpx}
.check-row{display:flex;align-items:center;margin-bottom:20rpx;cursor:pointer}
.checkbox{width:40rpx;height:40rpx;border:2rpx solid #ddd;border-radius:8rpx;display:flex;align-items:center;justify-content:center;margin-right:12rpx;background:#fff}
.checked{color:#2d8cf0;font-weight:bold}
.check-label{font-size:28rpx;color:#666}
.info{background:#fffbe6;border:2rpx solid #ffe58f;border-radius:8rpx;padding:16rpx;margin:16rpx 0;font-size:24rpx;color:#8c6e00}
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
.dc{display:block;font-size:24rpx;color:#555;line-height:1.8}
.dhl{display:block;font-size:24rpx;color:#2d8cf0;font-weight:bold;line-height:1.8}
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
