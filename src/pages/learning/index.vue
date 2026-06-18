<template>
  <view class="page">
    <view class="tabs">
      <view v-on:click="onTabChange(0)"><text v-if="tab===0" class="tab on">社保缴费</text><text v-else class="tab">社保缴费</text></view>
      <view v-on:click="onTabChange(1)"><text v-if="tab===1" class="tab on">个人所得税</text><text v-else class="tab">个人所得税</text></view>
    </view>

    <view v-if="tab===0" class="body">
      <view class="subs">
        <view v-on:click="onSubChange(0)"><text v-if="sub===0" class="sub on">企业职工</text><text v-else class="sub">企业职工</text></view>
        <view v-on:click="onSubChange(1)"><text v-if="sub===1" class="sub on">灵活就业</text><text v-else class="sub">灵活就业</text></view>
      </view>

      <view v-if="sub===0">
        <view class="card">
          <text class="title">输入参数</text>
          <view class="row"><text class="lbl">税前工资</text><input class="ipt" type="digit" :value="salary" @input="onSalaryInput"/><text class="ut">元/月</text></view>
          <view class="row"><text class="lbl">公积金基数</text><input class="ipt" type="digit" :value="fundBase" @input="onFundBaseInput" placeholder="默认等于工资"/><text class="ut">元</text></view>
          <view class="row"><text class="lbl">公积金比例</text><input class="ipt" type="digit" :value="fundRate" @input="onFundRateInput"/><text class="ut">%</text></view>
          <view class="info"><text>💡 社保基数范围：{{cfg.social.baseMin}} ~ {{cfg.social.baseMax}} 元</text></view>
        </view>

        <view class="card">
          <text class="title">📖 政策说明</text>
          <view class="know"><text class="kt">缴费基数规则</text><text class="kc">根据《社会保险法》第六十条：\n• 用人单位应按时足额缴纳社保费\n• 缴费基数为职工工资总额\n• 有上下限限制</text></view>
          <view class="know"><text class="kt">当前配置比例</text><text class="kc">单位：养老{{cfg.social.employerPension}}% 医疗{{cfg.social.employerMedical}}% 失业{{cfg.social.employerUnemployment}}% 工伤{{cfg.social.employerInjury}}%\n个人：养老{{cfg.social.employeePension}}% 医疗{{cfg.social.employeeMedical}}% 失业{{cfg.social.employeeUnemployment}}%</text></view>
        </view>

        <view v-if="r" class="card">
          <text class="title">计算结果</text>
          <view class="big">
            <view class="bi"><text class="bl">到手工资</text><text class="bv">{{r.takeHome}}</text></view>
            <view class="bi"><text class="bl">个人社保</text><text class="bv red">{{r.pt}}</text></view>
          </view>
          <text class="st">📝 详细计算过程</text>
          <view class="det">
            <text class="dh">【基数确定】</text>
            <text class="dc">输入工资: {{salary}} 元</text>
            <text class="dc">社保基数上下限: {{cfg.social.baseMin}} ~ {{cfg.social.baseMax}}</text>
            <text class="dhl">→ 实际社保基数: {{r.base}} 元</text>
            <text class="dc" v-if="fundBase">公积金基数: {{r.fb}} 元（单独设置）</text>
            <text class="dc" v-else>公积金基数: {{r.base}} 元（等于社保基数）</text>
          </view>
          <view class="det">
            <text class="dh">【单位缴费】</text>
            <text class="dc">养老 = {{r.base}} × {{cfg.social.employerPension}}% = {{r.ep}} 元</text>
            <text class="dc">医疗 = {{r.base}} × {{cfg.social.employerMedical}}% = {{r.em}} 元</text>
            <text class="dc">失业 = {{r.base}} × {{cfg.social.employerUnemployment}}% = {{r.eu}} 元</text>
            <text class="dc">工伤 = {{r.base}} × {{cfg.social.employerInjury}}% = {{r.ei}} 元</text>
            <text class="dc">公积金 = {{r.fb}} × {{fundRate}}% = {{r.ef}} 元</text>
            <text class="dhl">单位合计: {{r.et}} 元</text>
          </view>
          <view class="det">
            <text class="dh">【个人缴费】</text>
            <text class="dc">养老 = {{r.base}} × {{cfg.social.employeePension}}% = {{r.pp}} 元</text>
            <text class="dc">医疗 = {{r.base}} × {{cfg.social.employeeMedical}}% = {{r.pm}} 元</text>
            <text class="dc">失业 = {{r.base}} × {{cfg.social.employeeUnemployment}}% = {{r.pu}} 元</text>
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

      <view v-if="sub===1">
        <view class="card">
          <text class="title">灵活就业社保</text>
          <view class="row"><text class="lbl">缴费基数</text><input class="ipt" type="digit" :value="flexBase" @input="onFlexBaseInput"/><text class="ut">元</text></view>
          <view class="row"><text class="lbl">养老比例</text><input class="ipt" type="digit" :value="flexPen" @input="onFlexPenInput"/><text class="ut">%</text></view>
          <view class="row"><text class="lbl">医保比例</text><input class="ipt" type="digit" :value="flexMed" @input="onFlexMedInput"/><text class="ut">%</text></view>
        </view>
        <view v-if="fr" class="card">
          <text class="title">计算结果</text>
          <view class="big"><view class="bi"><text class="bl">当月应缴</text><text class="bv">{{fr.total}}</text></view></view>
          <view class="lst"><view class="li"><text>养老保险</text><text>{{fr.p}}</text></view><view class="li"><text>医疗保险</text><text>{{fr.m}}</text></view></view>
        </view>
      </view>
    </view>

    <view v-if="tab===1" class="body">
      <view class="card">
        <text class="title">综合所得（元/月）</text>
        <view class="row"><text class="lbl">工资薪金</text><input class="ipt" type="digit" :value="tSalary" @input="onTSalaryInput"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">劳务报酬</text><input class="ipt" type="digit" :value="tLabor" @input="onInput('tLabor',$event)"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">稿酬所得</text><input class="ipt" type="digit" :value="tAuthor" @input="onInput('tAuthor',$event)"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">特许权使用费</text><input class="ipt" type="digit" :value="tRoyalty" @input="onInput('tRoyalty',$event)"/><text class="ut">元</text></view>
      </view>

      <view class="card">
        <text class="title">其他所得（元/年）</text>
        <view class="row"><text class="lbl">经营所得</text><input class="ipt" type="digit" :value="tBusiness" @input="onInput('tBusiness',$event)"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">利息股息红利</text><input class="ipt" type="digit" :value="tDividend" @input="onInput('tDividend',$event)"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">财产租赁</text><input class="ipt" type="digit" :value="tRent" @input="onInput('tRent',$event)"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">财产转让</text><input class="ipt" type="digit" :value="tTransfer" @input="onInput('tTransfer',$event)"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">偶然所得</text><input class="ipt" type="digit" :value="tLuck" @input="onInput('tLuck',$event)"/><text class="ut">元</text></view>
      </view>

      <view class="card">
        <text class="title">扣除项目</text>
        <view class="row"><text class="lbl">个人社保/年</text><text class="val">{{yearSocial}} 元</text><text class="sync">自动同步</text></view>
        <view class="row"><text class="lbl">子女教育/月</text><input class="ipt" type="digit" :value="tChild" @input="onInput('tChild',$event)"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">继续教育/月</text><input class="ipt" type="digit" :value="tEdu" @input="onInput('tEdu',$event)"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">住房贷款/月</text><input class="ipt" type="digit" :value="tLoan" @input="onInput('tLoan',$event)"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">住房租金/月</text><input class="ipt" type="digit" :value="tRentDeduction" @input="onInput('tRentDeduction',$event)"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">赡养老人/月</text><input class="ipt" type="digit" :value="tElder" @input="onInput('tElder',$event)"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">婴幼儿照护/月</text><input class="ipt" type="digit" :value="tBaby" @input="onInput('tBaby',$event)"/><text class="ut">元</text></view>
      </view>

      <view class="card">
        <text class="title">📖 计算流程</text>
        <view class="proc"><text>① 综合所得 = 工资 + 劳务×80% + 稿酬×80%×70% + 特许权×80%\n② 应纳税所得额 = 综合所得 - 60,000 - 个人社保 - 专项附加\n③ 查综合所得税率表\n④ 加上经营所得税\n⑤ 加上比例税率所得（20%）\n⑥ = 年度总个税</text></view>
      </view>

      <view v-if="tr" class="card">
        <text class="title">计算结果</text>
        <view class="big">
          <view class="bi"><text class="bl">年度总个税</text><text class="bv">{{tr.totalTax}}</text></view>
          <view class="bi"><text class="bl">月均个税</text><text class="bv red">{{tr.monthlyTax}}</text></view>
        </view>

        <view class="det">
          <text class="dh">【综合所得】</text>
          <text class="dc">工资薪金: {{fmt((parseFloat(tSalary)||0)*12)}} 元/年</text>
          <text class="dc">劳务报酬: {{fmt((parseFloat(tLabor)||0)*12*0.8)}} 元 (×80%)</text>
          <text class="dc">稿酬所得: {{fmt((parseFloat(tAuthor)||0)*12*0.8*0.7)}} 元 (×80%×70%)</text>
          <text class="dc">特许权使用费: {{fmt((parseFloat(tRoyalty)||0)*12*0.8)}} 元 (×80%)</text>
          <text class="dhl">综合所得合计: {{tr.comprehensiveIncome}} 元</text>
        </view>

        <view class="det">
          <text class="dh">【扣除项目】</text>
          <text class="dc">基本减除: 60,000 元</text>
          <text class="dc">个人社保: {{yearSocial}} 元（自动同步）</text>
          <text class="dc">专项附加: {{fmt(specialTotal)}} 元</text>
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
    var inp = loadInput()
    return {
      tab: inp._ltab || 0,
      sub: inp._lsub || 0,
      cfg: loadConfig(),
      salary: inp.salary || '10000',
      fundBase: inp.fundBase || '',
      fundRate: inp.fundRate || '5',
      flexBase: inp.flexBase || '4986',
      flexPen: inp.flexPen || '20',
      flexMed: inp.flexMed || '8',
      tSalary: inp.tSalary || '10000',
      tLabor: inp.tLabor || '0',
      tAuthor: inp.tAuthor || '0',
      tRoyalty: inp.tRoyalty || '0',
      tBusiness: inp.tBusiness || '0',
      tDividend: inp.tDividend || '0',
      tRent: inp.tRent || '0',
      tTransfer: inp.tTransfer || '0',
      tLuck: inp.tLuck || '0',
      tChild: inp.tChild || '0',
      tEdu: inp.tEdu || '0',
      tLoan: inp.tLoan || '0',
      tRentDeduction: inp.tRentDeduction || '0',
      tElder: inp.tElder || '0',
      tBaby: inp.tBaby || '0',
      r: null,
      fr: null,
      tr: null,
      yearSocial: '0',
      specialTotal: 0
    }
  },
  onLoad() {
    this.cfg = loadConfig()
    this.calcAll()
    this.calcFlexResult()
  },
  onShow() {
    this.cfg = loadConfig()
  },
  methods: {
    fmt: fmt,
    calcAll() {
      var s = parseFloat(this.salary) || 0
      var fb = parseFloat(this.fundBase) || s
      var fr = parseFloat(this.fundRate) || 5
      var social = calcSocial(s, fb, fr, this.cfg)
      this.yearSocial = fmt(social.yearPt)

      var tax = calcTax({
        salary: (parseFloat(this.tSalary)||0) * 12,
        labor: (parseFloat(this.tLabor)||0) * 12,
        author: (parseFloat(this.tAuthor)||0) * 12,
        royalty: (parseFloat(this.tRoyalty)||0) * 12,
        business: parseFloat(this.tBusiness)||0,
        dividend: parseFloat(this.tDividend)||0,
        rent: parseFloat(this.tRent)||0,
        rentDeduction: 0,
        transfer: parseFloat(this.tTransfer)||0,
        transferCost: 0,
        luck: parseFloat(this.tLuck)||0,
        social: social.yearPt,
        childEducation: (parseFloat(this.tChild)||0)*12,
        continuingEducation: (parseFloat(this.tEdu)||0)*12,
        housingLoan: (parseFloat(this.tLoan)||0)*12,
        housingRent: (parseFloat(this.tRentDeduction)||0)*12,
        elderlySupport: (parseFloat(this.tElder)||0)*12,
        infantCare: (parseFloat(this.tBaby)||0)*12
      }, this.cfg)

      var takeHome = calcTakeHome(s, social.pt, tax.monthlyTax)

      this.specialTotal = ((parseFloat(this.tChild)||0)+(parseFloat(this.tEdu)||0)+
        (parseFloat(this.tLoan)||0)+(parseFloat(this.tRentDeduction)||0)+
        (parseFloat(this.tElder)||0)+(parseFloat(this.tBaby)||0))*12

      this.r = {
        base: fmt(social.base), fb: fmt(social.fundBase),
        ep: fmt(social.ep), em: fmt(social.em), eu: fmt(social.eu), ei: fmt(social.ei), ef: fmt(social.ef), et: fmt(social.et),
        pp: fmt(social.pp), pm: fmt(social.pm), pu: fmt(social.pu), pf: fmt(social.pf), pt: fmt(social.pt),
        yearPt: fmt(social.yearPt), takeHome: fmt(takeHome), monthlyTax: fmt(tax.monthlyTax)
      }

      this.tr = {
        totalTax: fmt(tax.totalTax), monthlyTax: fmt(tax.monthlyTax),
        comprehensiveIncome: fmt(tax.comprehensiveIncome),
        comprehensiveDeduction: fmt(tax.comprehensiveDeduction),
        taxableIncome: fmt(tax.comprehensiveTaxable),
        comprehensiveTax: fmt(tax.comprehensiveTax),
        comprehensiveBracket: tax.comprehensiveBracket,
        businessTax: fmt(tax.businessTax), proportionalTax: fmt(tax.proportionalTax)
      }
    },
    calcFlexResult() {
      var res = calcFlex(parseFloat(this.flexBase)||0, parseFloat(this.flexPen)||20, parseFloat(this.flexMed)||8, this.cfg)
      this.fr = { total: fmt(res.t), p: fmt(res.p), m: fmt(res.m) }
    },
    save() {
      saveInput({
        _ltab: this.tab, _lsub: this.sub,
        salary: this.salary, fundBase: this.fundBase, fundRate: this.fundRate,
        flexBase: this.flexBase, flexPen: this.flexPen, flexMed: this.flexMed,
        tSalary: this.tSalary, tLabor: this.tLabor, tAuthor: this.tAuthor, tRoyalty: this.tRoyalty,
        tBusiness: this.tBusiness, tDividend: this.tDividend, tRent: this.tRent,
        tTransfer: this.tTransfer, tLuck: this.tLuck,
        tChild: this.tChild, tEdu: this.tEdu, tLoan: this.tLoan,
        tRentDeduction: this.tRentDeduction, tElder: this.tElder, tBaby: this.tBaby
      })
    },
    onTabChange(v) { this.tab = v; this.save() },
    onSubChange(v) { this.sub = v; this.save(); if(v===1) this.calcFlexResult() },
    onSalaryInput(e) { this.salary = e.detail.value; this.tSalary = e.detail.value; this.save(); this.calcAll() },
    onFundBaseInput(e) { this.fundBase = e.detail.value; this.save(); this.calcAll() },
    onFundRateInput(e) { this.fundRate = e.detail.value; this.save(); this.calcAll() },
    onFlexBaseInput(e) { this.flexBase = e.detail.value; this.save(); this.calcFlexResult() },
    onFlexPenInput(e) { this.flexPen = e.detail.value; this.save(); this.calcFlexResult() },
    onFlexMedInput(e) { this.flexMed = e.detail.value; this.save(); this.calcFlexResult() },
    onTSalaryInput(e) { this.tSalary = e.detail.value; this.salary = e.detail.value; this.save(); this.calcAll() },
    onInput(key, e) { this[key] = e.detail.value; this.save(); this.calcAll() }
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
