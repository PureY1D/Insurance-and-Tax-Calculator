<template>
  <view class="page">
    <view class="tabs">
      <view v-on:click="onTabChange(0)"><text v-if="tab===0" class="tab on">社保缴费</text><text v-else class="tab">社保缴费</text></view>
      <view v-on:click="onTabChange(1)"><text v-if="tab===1" class="tab on">个人所得税</text><text v-else class="tab">个人所得税</text></view>
    </view>

    <!-- 社保页 -->
    <view v-if="tab===0" class="body">
      <view class="subs">
        <view v-on:click="onSubChange(0)"><text v-if="sub===0" class="sub on">企业职工</text><text v-else class="sub">企业职工</text></view>
        <view v-on:click="onSubChange(1)"><text v-if="sub===1" class="sub on">灵活就业</text><text v-else class="sub">灵活就业</text></view>
      </view>

      <!-- 企业职工 -->
      <view v-if="sub===0" class="card">
        <text class="title">企业职工五险一金</text>
        <view class="row"><text class="lbl">税前工资</text><input class="ipt" type="digit" :value="salary" @input="onSalaryInput"/><text class="ut">元/月</text></view>
        <view class="row"><text class="lbl">公积金基数</text><input class="ipt" type="digit" :value="fundBase" @input="onFundBaseInput" placeholder="默认等于工资"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">公积金比例</text><input class="ipt" type="digit" :value="fundRate" @input="onFundRateInput"/><text class="ut">%</text></view>
      </view>

      <view v-if="sub===0" class="card">
        <text class="title">计算结果</text>
        <view class="big">
          <view class="bi"><text class="bl">到手工资</text><text class="bv">{{takeHome}}</text></view>
          <view class="bi"><text class="bl">个人社保</text><text class="bv">{{personalTotal}}</text></view>
        </view>
        <view class="lst">
          <view class="li"><text>单位养老</text><text>{{employerPension}}</text></view>
          <view class="li"><text>单位医疗</text><text>{{employerMedical}}</text></view>
          <view class="li"><text>单位失业</text><text>{{employerUnemployment}}</text></view>
          <view class="li"><text>单位工伤</text><text>{{employerInjury}}</text></view>
          <view class="li"><text>单位公积金</text><text>{{employerFund}}</text></view>
          <view class="li"><text>个人养老</text><text>{{employeePension}}</text></view>
          <view class="li"><text>个人医疗</text><text>{{employeeMedical}}</text></view>
          <view class="li"><text>个人失业</text><text>{{employeeUnemployment}}</text></view>
          <view class="li"><text>个人公积金</text><text>{{employeeFund}}</text></view>
          <view class="li hl"><text>预估月个税</text><text>{{monthlyTax}}</text></view>
        </view>
      </view>

      <!-- 灵活就业 -->
      <view v-if="sub===1" class="card">
        <text class="title">灵活就业社保</text>
        <view class="row"><text class="lbl">缴费基数</text><input class="ipt" type="digit" :value="flexBase" @input="onFlexBaseInput"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">养老比例</text><input class="ipt" type="digit" :value="flexPen" @input="onFlexPenInput"/><text class="ut">%</text></view>
        <view class="row"><text class="lbl">医保比例</text><input class="ipt" type="digit" :value="flexMed" @input="onFlexMedInput"/><text class="ut">%</text></view>
      </view>

      <view v-if="sub===1" class="card">
        <text class="title">计算结果</text>
        <view class="big"><view class="bi"><text class="bl">当月应缴</text><text class="bv">{{flexTotal}}</text></view></view>
        <view class="lst">
          <view class="li"><text>养老保险</text><text>{{flexPension}}</text></view>
          <view class="li"><text>医疗保险</text><text>{{flexMedical}}</text></view>
        </view>
      </view>
    </view>

    <!-- 个税页 -->
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
        <view class="row"><text class="lbl">个人社保/年</text><text class="val">{{personalYearSocial}} 元</text><text class="sync">自动同步</text></view>
        <view class="row"><text class="lbl">子女教育/月</text><input class="ipt" type="digit" :value="tChild" @input="onInput('tChild',$event)"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">继续教育/月</text><input class="ipt" type="digit" :value="tEdu" @input="onInput('tEdu',$event)"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">住房贷款/月</text><input class="ipt" type="digit" :value="tLoan" @input="onInput('tLoan',$event)"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">住房租金/月</text><input class="ipt" type="digit" :value="tRentDeduction" @input="onInput('tRentDeduction',$event)"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">赡养老人/月</text><input class="ipt" type="digit" :value="tElder" @input="onInput('tElder',$event)"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">婴幼儿照护/月</text><input class="ipt" type="digit" :value="tBaby" @input="onInput('tBaby',$event)"/><text class="ut">元</text></view>
      </view>

      <view class="card">
        <text class="title">计算结果</text>
        <view class="big">
          <view class="bi"><text class="bl">年度总个税</text><text class="bv">{{taxTotal}}</text></view>
          <view class="bi"><text class="bl">月均个税</text><text class="bv red">{{taxMonthly}}</text></view>
        </view>
        <view class="lst">
          <view class="li"><text>应纳税所得额</text><text>{{taxableIncome}}</text></view>
          <view class="li"><text>综合所得税</text><text>{{comprehensiveTax}}</text></view>
          <view class="li"><text>经营所得税</text><text>{{businessTax}}</text></view>
          <view class="li"><text>比例税率税</text><text>{{proportionalTax}}</text></view>
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
    var cfg = loadConfig()
    var inp = loadInput()
    return {
      tab: inp._tab || 0,
      sub: inp._sub || 0,
      cfg: cfg,
      // 社保输入
      salary: inp.salary || '10000',
      fundBase: inp.fundBase || '',
      fundRate: inp.fundRate || '5',
      // 灵活就业
      flexBase: inp.flexBase || '4986',
      flexPen: inp.flexPen || '20',
      flexMed: inp.flexMed || '8',
      // 个税输入
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
      tBaby: inp.tBaby || '0'
    }
  },
  computed: {
    // 社保计算结果
    socialResult() {
      var s = parseFloat(this.salary) || 0
      var fb = parseFloat(this.fundBase) || s
      var fr = parseFloat(this.fundRate) || 5
      return calcSocial(s, fb, fr, this.cfg)
    },
    employerPension() { return fmt(this.socialResult.ep) },
    employerMedical() { return fmt(this.socialResult.em) },
    employerUnemployment() { return fmt(this.socialResult.eu) },
    employerInjury() { return fmt(this.socialResult.ei) },
    employerFund() { return fmt(this.socialResult.ef) },
    employeePension() { return fmt(this.socialResult.pp) },
    employeeMedical() { return fmt(this.socialResult.pm) },
    employeeUnemployment() { return fmt(this.socialResult.pu) },
    employeeFund() { return fmt(this.socialResult.pf) },
    personalTotal() { return fmt(this.socialResult.pt) },
    personalYearSocial() { return fmt(this.socialResult.yearPt) },

    // 灵活就业
    flexResult() {
      return calcFlex(parseFloat(this.flexBase)||0, parseFloat(this.flexPen)||20, parseFloat(this.flexMed)||8, this.cfg)
    },
    flexTotal() { return fmt(this.flexResult.t) },
    flexPension() { return fmt(this.flexResult.p) },
    flexMedical() { return fmt(this.flexResult.m) },

    // 个税计算
    taxResult() {
      var socialYear = this.socialResult.yearPt
      return calcTax({
        salary: (parseFloat(this.tSalary)||0)*12,
        labor: (parseFloat(this.tLabor)||0)*12,
        author: (parseFloat(this.tAuthor)||0)*12,
        royalty: (parseFloat(this.tRoyalty)||0)*12,
        business: parseFloat(this.tBusiness)||0,
        dividend: parseFloat(this.tDividend)||0,
        rent: parseFloat(this.tRent)||0,
        rentDeduction: 0,
        transfer: parseFloat(this.tTransfer)||0,
        transferCost: 0,
        luck: parseFloat(this.tLuck)||0,
        social: socialYear,
        childEducation: (parseFloat(this.tChild)||0)*12,
        continuingEducation: (parseFloat(this.tEdu)||0)*12,
        housingLoan: (parseFloat(this.tLoan)||0)*12,
        housingRent: (parseFloat(this.tRentDeduction)||0)*12,
        elderlySupport: (parseFloat(this.tElder)||0)*12,
        infantCare: (parseFloat(this.tBaby)||0)*12
      }, this.cfg)
    },
    taxTotal() { return fmt(this.taxResult.totalTax) },
    taxMonthly() { return fmt(this.taxResult.monthlyTax) },
    taxableIncome() { return fmt(this.taxResult.comprehensiveTaxable) },
    comprehensiveTax() { return fmt(this.taxResult.comprehensiveTax) },
    businessTax() { return fmt(this.taxResult.businessTax) },
    proportionalTax() { return fmt(this.taxResult.proportionalTax) },

    // 到手工资
    takeHome() {
      var s = parseFloat(this.salary) || 0
      var pt = this.socialResult.pt
      var mt = this.taxResult.monthlyTax
      return fmt(calcTakeHome(s, pt, mt))
    },
    monthlyTax() { return this.taxMonthly }
  },
  onLoad() { this.cfg = loadConfig() },
  onShow() { this.cfg = loadConfig() },
  methods: {
    save() {
      saveInput({
        _tab: this.tab, _sub: this.sub,
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
    onSubChange(v) { this.sub = v; this.save() },
    onSalaryInput(e) {
      this.salary = e.detail.value
      this.tSalary = e.detail.value
      this.save()
    },
    onFundBaseInput(e) { this.fundBase = e.detail.value; this.save() },
    onFundRateInput(e) { this.fundRate = e.detail.value; this.save() },
    onFlexBaseInput(e) { this.flexBase = e.detail.value; this.save() },
    onFlexPenInput(e) { this.flexPen = e.detail.value; this.save() },
    onFlexMedInput(e) { this.flexMed = e.detail.value; this.save() },
    onTSalaryInput(e) {
      this.tSalary = e.detail.value
      this.salary = e.detail.value
      this.save()
    },
    onInput(key, e) { this[key] = e.detail.value; this.save() }
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
