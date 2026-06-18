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

      <!-- 企业职工 -->
      <view v-if="sub===0" class="card">
        <text class="title">企业职工五险一金</text>
        <view class="row"><text class="lbl">税前工资</text><input class="ipt" type="digit" :value="input.salary" @input="onSalaryInput"/><text class="ut">元/月</text></view>
        <view class="row"><text class="lbl">公积金基数</text><input class="ipt" type="digit" :value="input.fundBase" @input="onFundBaseInput" placeholder="默认等于工资"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">公积金比例</text><input class="ipt" type="digit" :value="input.fundRate" @input="onFundRateInput"/><text class="ut">%</text></view>
      </view>

      <view v-if="sub===0" class="card">
        <text class="title">计算结果</text>
        <view class="big">
          <view class="bi"><text class="bl">到手工资</text><text class="bv">{{sr.takeHome}}</text></view>
          <view class="bi"><text class="bl">个人社保</text><text class="bv">{{sr.pt}}</text></view>
        </view>
        <view class="lst">
          <view class="li"><text>单位养老</text><text>{{sr.ep}}</text></view>
          <view class="li"><text>单位医疗</text><text>{{sr.em}}</text></view>
          <view class="li"><text>单位失业</text><text>{{sr.eu}}</text></view>
          <view class="li"><text>单位工伤</text><text>{{sr.ei}}</text></view>
          <view class="li"><text>单位公积金</text><text>{{sr.ef}}</text></view>
          <view class="li"><text>个人养老</text><text>{{sr.pp}}</text></view>
          <view class="li"><text>个人医疗</text><text>{{sr.pm}}</text></view>
          <view class="li"><text>个人失业</text><text>{{sr.pu}}</text></view>
          <view class="li"><text>个人公积金</text><text>{{sr.pf}}</text></view>
          <view class="li hl"><text>预估月个税</text><text>{{tr.monthlyTax}}</text></view>
        </view>
      </view>

      <!-- 灵活就业 -->
      <view v-if="sub===1" class="card">
        <text class="title">灵活就业社保</text>
        <view class="row"><text class="lbl">缴费基数</text><input class="ipt" type="digit" :value="input.flexBase" @input="onFlexBaseInput"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">养老比例</text><input class="ipt" type="digit" :value="input.flexPen" @input="onFlexPenInput"/><text class="ut">%</text></view>
        <view class="row"><text class="lbl">医保比例</text><input class="ipt" type="digit" :value="input.flexMed" @input="onFlexMedInput"/><text class="ut">%</text></view>
      </view>

      <view v-if="sub===1" class="card">
        <text class="title">计算结果</text>
        <view class="big"><view class="bi"><text class="bl">当月应缴</text><text class="bv">{{fr.t}}</text></view></view>
        <view class="lst">
          <view class="li"><text>养老保险</text><text>{{fr.p}}</text></view>
          <view class="li"><text>医疗保险</text><text>{{fr.m}}</text></view>
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
        <text class="title">计算结果</text>
        <view class="big">
          <view class="bi"><text class="bl">年度总个税</text><text class="bv">{{tr.totalTax}}</text></view>
          <view class="bi"><text class="bl">月均个税</text><text class="bv red">{{tr.monthlyTax}}</text></view>
        </view>
        <view class="lst">
          <view class="li"><text>应纳税所得额</text><text>{{tr.comprehensiveTaxable}}</text></view>
          <view class="li"><text>综合所得税</text><text>{{tr.comprehensiveTax}}</text></view>
          <view class="li"><text>经营所得税</text><text>{{tr.businessTax}}</text></view>
          <view class="li"><text>比例税率税</text><text>{{tr.proportionalTax}}</text></view>
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
      cfg: null,
      input: null
    }
  },
  computed: {
    sr() {
      if (!this.cfg || !this.input) return { ep:'0.00',em:'0.00',eu:'0.00',ei:'0.00',ef:'0.00',et:'0.00',pp:'0.00',pm:'0.00',pu:'0.00',pf:'0.00',pt:'0.00',yearPt:'0.00',takeHome:'0.00' }
      var salary = parseFloat(this.input.salary) || 0
      var fundBase = parseFloat(this.input.fundBase) || 0
      var fundRate = parseFloat(this.input.fundRate) || 5
      var res = calcSocial(salary, fundBase || salary, fundRate, this.cfg)
      var takeHome = calcTakeHome(salary, res.pt, parseFloat(this.tr.monthlyTax) || 0)
      return {
        base: fmt(res.base), ep: fmt(res.ep), em: fmt(res.em), eu: fmt(res.eu), ei: fmt(res.ei), ef: fmt(res.ef), et: fmt(res.et),
        pp: fmt(res.pp), pm: fmt(res.pm), pu: fmt(res.pu), pf: fmt(res.pf), pt: fmt(res.pt),
        yearPt: fmt(res.yearPt), takeHome: fmt(takeHome)
      }
    },
    fr() {
      if (!this.cfg || !this.input) return { t:'0.00',p:'0.00',m:'0.00' }
      var res = calcFlex(parseFloat(this.input.flexBase)||0, parseFloat(this.input.flexPen)||20, parseFloat(this.input.flexMed)||8, this.cfg)
      return { t: fmt(res.t), p: fmt(res.p), m: fmt(res.m) }
    },
    tr() {
      if (!this.cfg || !this.input) return { totalTax:'0.00',monthlyTax:'0.00',comprehensiveTaxable:'0.00',comprehensiveTax:'0.00',businessTax:'0.00',proportionalTax:'0.00' }
      var salary = parseFloat(this.input.tSalary) || 0
      var socialYear = parseFloat(this.sr.yearPt) || 0
      var res = calcTax({
        salary: salary * 12,
        labor: (parseFloat(this.input.tLabor)||0) * 12,
        author: (parseFloat(this.input.tAuthor)||0) * 12,
        royalty: (parseFloat(this.input.tRoyalty)||0) * 12,
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
        comprehensiveTaxable: fmt(res.comprehensiveTaxable),
        comprehensiveTax: fmt(res.comprehensiveTax),
        businessTax: fmt(res.businessTax), proportionalTax: fmt(res.proportionalTax)
      }
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
    save() { saveInput(this.input) },
    onSalaryInput(e) {
      this.input.salary = e.detail.value
      this.input.tSalary = e.detail.value  // 同步到个税页
      this.save()
    },
    onFundBaseInput(e) { this.input.fundBase = e.detail.value; this.save() },
    onFundRateInput(e) { this.input.fundRate = e.detail.value; this.save() },
    onFlexBaseInput(e) { this.input.flexBase = e.detail.value; this.save() },
    onFlexPenInput(e) { this.input.flexPen = e.detail.value; this.save() },
    onFlexMedInput(e) { this.input.flexMed = e.detail.value; this.save() },
    onTSalaryInput(e) {
      this.input.tSalary = e.detail.value
      this.input.salary = e.detail.value  // 同步到社保页
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
.title{display:block;font-size:32rpx;font-weight:bold;color:#333;margin-bottom:24rpx;text-align:center}
.row{display:flex;align-items:center;margin-bottom:20rpx}
.lbl{width:180rpx;font-size:28rpx;color:#666}
.ipt{flex:1;height:80rpx;border:2rpx solid #e5e5e5;border-radius:8rpx;padding:0 16rpx;font-size:28rpx}
.ut{font-size:24rpx;color:#999;margin-left:12rpx}
.val{flex:1;font-size:28rpx;color:#2d8cf0;font-weight:bold}
.sync{font-size:22rpx;color:#999;background:#f0f0f0;padding:4rpx 12rpx;border-radius:8rpx;margin-left:12rpx}
.big{display:flex;justify-content:space-around;padding:20rpx 0;border-bottom:2rpx solid #f0f0f0;margin-bottom:20rpx}
.bi{text-align:center}
.bl{display:block;font-size:24rpx;color:#999;margin-bottom:10rpx}
.bv{font-size:44rpx;font-weight:bold;color:#2d8cf0}
.bv.red{color:#f56c6c}
.lst{padding:0 10rpx}
.li{display:flex;justify-content:space-between;padding:16rpx 0;border-bottom:1rpx solid #f5f5f5;font-size:28rpx}
.li.hl{background:#fffbe6}
.li text:first-child{color:#666}
.li text:last-child{color:#333}
</style>
