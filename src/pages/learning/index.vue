<template>
  <view class="page">
    <view class="tabs">
      <view v-on:click="tab=0"><text v-if="tab===0" class="tab on">社保缴费</text><text v-else class="tab">社保缴费</text></view>
      <view v-on:click="tab=1"><text v-if="tab===1" class="tab on">个人所得税</text><text v-else class="tab">个人所得税</text></view>
    </view>

    <!-- 社保页 -->
    <view v-if="tab===0" class="body">
      <view class="subs">
        <view v-on:click="sub=0"><text v-if="sub===0" class="sub on">企业职工</text><text v-else class="sub">企业职工</text></view>
        <view v-on:click="sub=1"><text v-if="sub===1" class="sub on">灵活就业</text><text v-else class="sub">灵活就业</text></view>
      </view>

      <view v-if="sub===0">
        <view class="card">
          <text class="title">输入参数</text>
          <view class="row"><text class="lbl">税前工资</text><input class="ipt" type="digit" :value="input.salary" @input="onSalaryInput"/><text class="ut">元/月</text></view>
          <view class="row"><text class="lbl">公积金基数</text><input class="ipt" type="digit" :value="input.fundBase" @input="onFundBaseInput" placeholder="默认等于工资"/><text class="ut">元</text></view>
          <view class="row"><text class="lbl">公积金比例</text><input class="ipt" type="digit" :value="input.fundRate" @input="onFundRateInput"/><text class="ut">%</text></view>
          <view class="info"><text>💡 社保基数范围：{{cfg.social.baseMin}} ~ {{cfg.social.baseMax}} 元</text></view>
        </view>

        <view class="card">
          <text class="title">📖 政策说明</text>
          <view class="know"><text class="kt">缴费基数规则</text><text class="kc">根据《社会保险法》第六十条：\n• 用人单位应按时足额缴纳社保费\n• 缴费基数为职工工资总额\n• 有上下限限制</text></view>
          <view class="know"><text class="kt">当前配置比例</text><text class="kc">单位：养老{{cfg.social.employerPension}}% 医疗{{cfg.social.employerMedical}}% 失业{{cfg.social.employerUnemployment}}% 工伤{{cfg.social.employerInjury}}%\n个人：养老{{cfg.social.employeePension}}% 医疗{{cfg.social.employeeMedical}}% 失业{{cfg.social.employeeUnemployment}}%</text></view>
        </view>

        <view class="card">
          <text class="title">计算结果</text>
          <view class="big">
            <view class="bi"><text class="bl">到手工资</text><text class="bv">{{takeHome}}</text></view>
            <view class="bi"><text class="bl">个人社保</text><text class="bv red">{{sr.pt}}</text></view>
          </view>
          <text class="st">📝 详细计算过程</text>
          <view class="det">
            <text class="dh">【基数确定】</text>
            <text class="dc">输入工资: {{input.salary}} 元</text>
            <text class="dc">社保基数上下限: {{cfg.social.baseMin}} ~ {{cfg.social.baseMax}}</text>
            <text class="dhl">→ 实际社保基数: {{sr.base}} 元</text>
            <text class="dc" v-if="input.fundBase">公积金基数: {{sr.fundBase}} 元（单独设置）</text>
            <text class="dc" v-else>公积金基数: {{sr.base}} 元（等于社保基数）</text>
          </view>
          <view class="det">
            <text class="dh">【单位缴费】</text>
            <text class="dc">养老 = {{sr.base}} × {{cfg.social.employerPension}}% = {{sr.ep}} 元</text>
            <text class="dc">医疗 = {{sr.base}} × {{cfg.social.employerMedical}}% = {{sr.em}} 元</text>
            <text class="dc">失业 = {{sr.base}} × {{cfg.social.employerUnemployment}}% = {{sr.eu}} 元</text>
            <text class="dc">工伤 = {{sr.base}} × {{cfg.social.employerInjury}}% = {{sr.ei}} 元</text>
            <text class="dc">公积金 = {{sr.fundBase}} × {{input.fundRate}}% = {{sr.ef}} 元</text>
            <text class="dhl">单位合计: {{sr.et}} 元</text>
          </view>
          <view class="det">
            <text class="dh">【个人缴费】</text>
            <text class="dc">养老 = {{sr.base}} × {{cfg.social.employeePension}}% = {{sr.pp}} 元</text>
            <text class="dc">医疗 = {{sr.base}} × {{cfg.social.employeeMedical}}% = {{sr.pm}} 元</text>
            <text class="dc">失业 = {{sr.base}} × {{cfg.social.employeeUnemployment}}% = {{sr.pu}} 元</text>
            <text class="dc">公积金 = {{sr.fundBase}} × {{input.fundRate}}% = {{sr.pf}} 元</text>
            <text class="dhl">个人合计: {{sr.pt}} 元/月，{{sr.yearPt}} 元/年</text>
          </view>
          <view class="det">
            <text class="dh">【到手工资】</text>
            <text class="dc">税前工资: {{input.salary}} 元</text>
            <text class="dc">个人社保: -{{sr.pt}} 元</text>
            <text class="dc">预估个税: -{{tr.monthlyTax}} 元</text>
            <text class="dhl">到手工资: {{takeHome}} 元</text>
          </view>
        </view>
      </view>

      <view v-if="sub===1">
        <view class="card">
          <text class="title">灵活就业社保</text>
          <view class="row"><text class="lbl">缴费基数</text><input class="ipt" type="digit" :value="input.flexBase" @input="onFlexBaseInput"/><text class="ut">元</text></view>
          <view class="row"><text class="lbl">养老比例</text><input class="ipt" type="digit" :value="input.flexPen" @input="onFlexPenInput"/><text class="ut">%</text></view>
          <view class="row"><text class="lbl">医保比例</text><input class="ipt" type="digit" :value="input.flexMed" @input="onFlexMedInput"/><text class="ut">%</text></view>
        </view>
        <view class="card">
          <text class="title">计算结果</text>
          <view class="big"><view class="bi"><text class="bl">当月应缴</text><text class="bv">{{fr.t}}</text></view></view>
          <view class="lst"><view class="li"><text>养老保险</text><text>{{fr.p}}</text></view><view class="li"><text>医疗保险</text><text>{{fr.m}}</text></view></view>
        </view>
      </view>
    </view>

    <!-- 个税页 -->
    <view v-if="tab===1" class="body">
      <view class="card">
        <text class="title">综合所得（元/月）</text>
        <view class="row"><text class="lbl">工资薪金</text><input class="ipt" type="digit" :value="input.tSalary" @input="onTSalaryInput"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">劳务报酬</text><input class="ipt" type="digit" :value="input.tLabor" @input="onInput('tLabor',$event)"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">稿酬所得</text><input class="ipt" type="digit" :value="input.tAuthor" @input="onInput('tAuthor',$event)"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">特许权使用费</text><input class="ipt" type="digit" :value="input.tRoyalty" @input="onInput('tRoyalty',$event)"/><text class="ut">元</text></view>
      </view>

      <view class="card">
        <text class="title">其他所得（元/年）</text>
        <view class="row"><text class="lbl">经营所得</text><input class="ipt" type="digit" :value="input.tBusiness" @input="onInput('tBusiness',$event)"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">利息股息红利</text><input class="ipt" type="digit" :value="input.tDividend" @input="onInput('tDividend',$event)"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">财产租赁</text><input class="ipt" type="digit" :value="input.tRent" @input="onInput('tRent',$event)"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">财产转让</text><input class="ipt" type="digit" :value="input.tTransfer" @input="onInput('tTransfer',$event)"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">偶然所得</text><input class="ipt" type="digit" :value="input.tLuck" @input="onInput('tLuck',$event)"/><text class="ut">元</text></view>
      </view>

      <view class="card">
        <text class="title">扣除项目</text>
        <view class="row"><text class="lbl">个人社保/年</text><text class="val">{{sr.yearPt}} 元</text><text class="sync">自动同步</text></view>
        <view class="row"><text class="lbl">子女教育/月</text><input class="ipt" type="digit" :value="input.tChild" @input="onInput('tChild',$event)"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">继续教育/月</text><input class="ipt" type="digit" :value="input.tEdu" @input="onInput('tEdu',$event)"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">住房贷款/月</text><input class="ipt" type="digit" :value="input.tLoan" @input="onInput('tLoan',$event)"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">住房租金/月</text><input class="ipt" type="digit" :value="input.tRentDeduction" @input="onInput('tRentDeduction',$event)"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">赡养老人/月</text><input class="ipt" type="digit" :value="input.tElder" @input="onInput('tElder',$event)"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">婴幼儿照护/月</text><input class="ipt" type="digit" :value="input.tBaby" @input="onInput('tBaby',$event)"/><text class="ut">元</text></view>
      </view>

      <view class="card">
        <text class="title">📖 计算流程</text>
        <view class="proc"><text>① 综合所得 = 工资 + 劳务×80% + 稿酬×80%×70% + 特许权×80%\n② 应纳税所得额 = 综合所得 - 60,000 - 个人社保 - 专项附加\n③ 查综合所得税率表\n④ 加上经营所得税\n⑤ 加上比例税率所得（20%）\n⑥ = 年度总个税</text></view>
      </view>

      <view class="card">
        <text class="title">计算结果</text>
        <view class="big">
          <view class="bi"><text class="bl">年度总个税</text><text class="bv">{{tr.totalTax}}</text></view>
          <view class="bi"><text class="bl">月均个税</text><text class="bv red">{{tr.monthlyTax}}</text></view>
        </view>

        <view class="det">
          <text class="dh">【综合所得】</text>
          <text class="dc">工资薪金: {{fmt((parseFloat(input.tSalary)||0)*12)}} 元/年</text>
          <text class="dc">劳务报酬: {{fmt((parseFloat(input.tLabor)||0)*12*0.8)}} 元 (×80%)</text>
          <text class="dc">稿酬所得: {{fmt((parseFloat(input.tAuthor)||0)*12*0.8*0.7)}} 元 (×80%×70%)</text>
          <text class="dc">特许权使用费: {{fmt((parseFloat(input.tRoyalty)||0)*12*0.8)}} 元 (×80%)</text>
          <text class="dhl">综合所得合计: {{tr.comprehensiveIncome}} 元</text>
        </view>

        <view class="det">
          <text class="dh">【扣除项目】</text>
          <text class="dc">基本减除: 60,000 元</text>
          <text class="dc">个人社保: {{sr.yearPt}} 元（自动同步）</text>
          <text class="dc">专项附加: {{fmt(specialTotal)}} 元</text>
          <text class="dhl">扣除合计: {{tr.comprehensiveDeduction}} 元</text>
        </view>

        <view class="det">
          <text class="dh">【综合所得税】</text>
          <text class="dc">应纳税所得额 = {{tr.comprehensiveIncome}} - {{tr.comprehensiveDeduction}} = {{tr.comprehensiveTaxable}} 元</text>
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
      tab: 0, sub: 0,
      cfg: loadConfig(),
      input: loadInput()
    }
  },
  computed: {
    specialTotal() {
      if (!this.input) return 0
      return ((parseFloat(this.input.tChild)||0)+(parseFloat(this.input.tEdu)||0)+
        (parseFloat(this.input.tLoan)||0)+(parseFloat(this.input.tRentDeduction)||0)+
        (parseFloat(this.input.tElder)||0)+(parseFloat(this.input.tBaby)||0))*12
    },
    sr() {
      if (!this.cfg || !this.input) return { base:'0.00',fundBase:'0.00',ep:'0.00',em:'0.00',eu:'0.00',ei:'0.00',ef:'0.00',et:'0.00',pp:'0.00',pm:'0.00',pu:'0.00',pf:'0.00',pt:'0.00',yearPt:'0.00',ptNum:0 }
      var salary = parseFloat(this.input.salary) || 0
      var fundBase = parseFloat(this.input.fundBase) || 0
      var fundRate = parseFloat(this.input.fundRate) || 5
      var res = calcSocial(salary, fundBase || salary, fundRate, this.cfg)
      return {
        base: fmt(res.base), fundBase: fmt(res.fundBase),
        ep: fmt(res.ep), em: fmt(res.em), eu: fmt(res.eu), ei: fmt(res.ei), ef: fmt(res.ef), et: fmt(res.et),
        pp: fmt(res.pp), pm: fmt(res.pm), pu: fmt(res.pu), pf: fmt(res.pf), pt: fmt(res.pt),
        yearPt: fmt(res.yearPt), ptNum: res.pt
      }
    },
    fr() {
      if (!this.cfg || !this.input) return { t:'0.00',p:'0.00',m:'0.00' }
      var res = calcFlex(parseFloat(this.input.flexBase)||0, parseFloat(this.input.flexPen)||20, parseFloat(this.input.flexMed)||8, this.cfg)
      return { t: fmt(res.t), p: fmt(res.p), m: fmt(res.m) }
    },
    tr() {
      if (!this.cfg || !this.input) return { totalTax:'0.00',monthlyTax:'0.00',comprehensiveIncome:'0.00',comprehensiveDeduction:'0.00',comprehensiveTaxable:'0.00',comprehensiveTax:'0.00',comprehensiveBracket:'',businessTax:'0.00',proportionalTax:'0.00' }
      var socialYear = this.sr.ptNum ? this.sr.ptNum * 12 : 0
      var res = calcTax({
        salary: (parseFloat(this.input.tSalary)||0)*12,
        labor: (parseFloat(this.input.tLabor)||0)*12,
        author: (parseFloat(this.input.tAuthor)||0)*12,
        royalty: (parseFloat(this.input.tRoyalty)||0)*12,
        business: parseFloat(this.input.tBusiness)||0,
        dividend: parseFloat(this.input.tDividend)||0,
        rent: parseFloat(this.input.tRent)||0,
        rentDeduction: 0,
        transfer: parseFloat(this.input.tTransfer)||0,
        transferCost: 0,
        luck: parseFloat(this.input.tLuck)||0,
        social: socialYear,
        childEducation: (parseFloat(this.input.tChild)||0)*12,
        continuingEducation: (parseFloat(this.input.tEdu)||0)*12,
        housingLoan: (parseFloat(this.input.tLoan)||0)*12,
        housingRent: (parseFloat(this.input.tRentDeduction)||0)*12,
        elderlySupport: (parseFloat(this.input.tElder)||0)*12,
        infantCare: (parseFloat(this.input.tBaby)||0)*12
      }, this.cfg)
      return {
        totalTax: fmt(res.totalTax), monthlyTax: fmt(res.monthlyTax),
        comprehensiveIncome: fmt(res.comprehensiveIncome),
        comprehensiveDeduction: fmt(res.comprehensiveDeduction),
        comprehensiveTaxable: fmt(res.comprehensiveTaxable),
        comprehensiveTax: fmt(res.comprehensiveTax),
        comprehensiveBracket: res.comprehensiveBracket,
        businessTax: fmt(res.businessTax), proportionalTax: fmt(res.proportionalTax)
      }
    },
    takeHome() {
      var salary = parseFloat(this.input.salary) || 0
      var pt = this.sr.ptNum || 0
      var monthlyTax = parseFloat(this.tr.monthlyTax) || 0
      return fmt(calcTakeHome(salary, pt, monthlyTax))
    }
  },
  onLoad() {
    this.cfg = loadConfig()
    this.input = loadInput()
  },
  onShow() {
    this.cfg = loadConfig()
  },
  methods: {
    fmt: fmt,
    save() { saveInput(this.input) },
    onSalaryInput(e) {
      this.input.salary = e.detail.value
      this.input.tSalary = e.detail.value
      this.save()
    },
    onFundBaseInput(e) { this.input.fundBase = e.detail.value; this.save() },
    onFundRateInput(e) { this.input.fundRate = e.detail.value; this.save() },
    onFlexBaseInput(e) { this.input.flexBase = e.detail.value; this.save() },
    onFlexPenInput(e) { this.input.flexPen = e.detail.value; this.save() },
    onFlexMedInput(e) { this.input.flexMed = e.detail.value; this.save() },
    onTSalaryInput(e) {
      this.input.tSalary = e.detail.value
      this.input.salary = e.detail.value
      this.save()
    },
    onInput(key, e) { this.input[key] = e.detail.value; this.save() }
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
