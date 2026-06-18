<template>
  <view class="page">
    <view class="tabs">
      <view v-on:click="tab=0"><text v-if="tab===0" class="tab on">社保缴费</text><text v-else class="tab">社保缴费</text></view>
      <view v-on:click="tab=1"><text v-if="tab===1" class="tab on">个人所得税</text><text v-else class="tab">个人所得税</text></view>
    </view>

    <view v-if="tab===0" class="body">
      <view class="subs">
        <view v-on:click="sub=0"><text v-if="sub===0" class="sub on">企业职工</text><text v-else class="sub">企业职工</text></view>
        <view v-on:click="sub=1"><text v-if="sub===1" class="sub on">灵活就业</text><text v-else class="sub">灵活就业</text></view>
      </view>

      <view v-if="sub===0" class="card">
        <text class="title">企业职工五险一金</text>
        <view class="row"><text class="lbl">税前工资</text><input class="ipt" type="digit" :value="salary" @input="onSalary"/><text class="ut">元/月</text></view>
        <view class="row"><text class="lbl">公积金基数</text><input class="ipt" type="digit" :value="fundBase" @input="onFundBase" placeholder="默认等于工资"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">公积金比例</text><input class="ipt" type="digit" :value="fundRate" @input="onFundRate"/><text class="ut">%</text></view>
      </view>

      <view v-if="sub===0 && result" class="card">
        <text class="title">计算结果</text>
        <view class="big">
          <view class="bi"><text class="bl">到手工资</text><text class="bv">{{result.takeHome}}</text></view>
          <view class="bi"><text class="bl">个人社保</text><text class="bv">{{result.pt}}</text></view>
        </view>
        <view class="lst">
          <view class="li"><text>单位养老</text><text>{{result.ep}}</text></view>
          <view class="li"><text>单位医疗</text><text>{{result.em}}</text></view>
          <view class="li"><text>单位失业</text><text>{{result.eu}}</text></view>
          <view class="li"><text>单位工伤</text><text>{{result.ei}}</text></view>
          <view class="li"><text>单位公积金</text><text>{{result.ef}}</text></view>
          <view class="li"><text>个人养老</text><text>{{result.pp}}</text></view>
          <view class="li"><text>个人医疗</text><text>{{result.pm}}</text></view>
          <view class="li"><text>个人失业</text><text>{{result.pu}}</text></view>
          <view class="li"><text>个人公积金</text><text>{{result.pf}}</text></view>
          <view class="li hl"><text>预估月个税</text><text>{{result.monthlyTax}}</text></view>
        </view>
      </view>

      <view v-if="sub===1" class="card">
        <text class="title">灵活就业社保</text>
        <view class="row"><text class="lbl">缴费基数</text><input class="ipt" type="digit" :value="flexBase" @input="onFlexBase"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">养老比例</text><input class="ipt" type="digit" :value="flexPen" @input="onFlexPen"/><text class="ut">%</text></view>
        <view class="row"><text class="lbl">医保比例</text><input class="ipt" type="digit" :value="flexMed" @input="onFlexMed"/><text class="ut">%</text></view>
      </view>

      <view v-if="sub===1 && flexResult" class="card">
        <text class="title">计算结果</text>
        <view class="big"><view class="bi"><text class="bl">当月应缴</text><text class="bv">{{flexResult.total}}</text></view></view>
        <view class="lst">
          <view class="li"><text>养老保险</text><text>{{flexResult.p}}</text></view>
          <view class="li"><text>医疗保险</text><text>{{flexResult.m}}</text></view>
        </view>
      </view>
    </view>

    <view v-if="tab===1" class="body">
      <view class="card">
        <text class="title">综合所得（元/月）</text>
        <view class="row"><text class="lbl">工资薪金</text><input class="ipt" type="digit" :value="tSalary" @input="onTSalary"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">劳务报酬</text><input class="ipt" type="digit" :value="tLabor" @input="onTLabor"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">稿酬所得</text><input class="ipt" type="digit" :value="tAuthor" @input="onTAuthor"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">特许权使用费</text><input class="ipt" type="digit" :value="tRoyalty" @input="onTRoyalty"/><text class="ut">元</text></view>
      </view>

      <view class="card">
        <text class="title">其他所得（元/年）</text>
        <view class="row"><text class="lbl">经营所得</text><input class="ipt" type="digit" :value="tBusiness" @input="onTBusiness"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">利息股息红利</text><input class="ipt" type="digit" :value="tDividend" @input="onTDividend"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">财产租赁</text><input class="ipt" type="digit" :value="tRent" @input="onTRent"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">财产转让</text><input class="ipt" type="digit" :value="tTransfer" @input="onTTransfer"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">偶然所得</text><input class="ipt" type="digit" :value="tLuck" @input="onTLuck"/><text class="ut">元</text></view>
      </view>

      <view class="card">
        <text class="title">扣除项目</text>
        <view class="row"><text class="lbl">个人社保/年</text><text class="val">{{yearSocial}} 元</text><text class="sync">自动同步</text></view>
        <view class="row"><text class="lbl">子女教育/月</text><input class="ipt" type="digit" :value="tChild" @input="onTChild"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">继续教育/月</text><input class="ipt" type="digit" :value="tEdu" @input="onTEdu"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">住房贷款/月</text><input class="ipt" type="digit" :value="tLoan" @input="onTLoan"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">住房租金/月</text><input class="ipt" type="digit" :value="tRentDeduction" @input="onTRentDeduction"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">赡养老人/月</text><input class="ipt" type="digit" :value="tElder" @input="onTElder"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">婴幼儿照护/月</text><input class="ipt" type="digit" :value="tBaby" @input="onTBaby"/><text class="ut">元</text></view>
      </view>

      <view v-if="taxResult" class="card">
        <text class="title">计算结果</text>
        <view class="big">
          <view class="bi"><text class="bl">年度总个税</text><text class="bv">{{taxResult.totalTax}}</text></view>
          <view class="bi"><text class="bl">月均个税</text><text class="bv red">{{taxResult.monthlyTax}}</text></view>
        </view>
        <view class="lst">
          <view class="li"><text>应纳税所得额</text><text>{{taxResult.taxableIncome}}</text></view>
          <view class="li"><text>综合所得税</text><text>{{taxResult.comprehensiveTax}}</text></view>
          <view class="li"><text>经营所得税</text><text>{{taxResult.businessTax}}</text></view>
          <view class="li"><text>比例税率税</text><text>{{taxResult.proportionalTax}}</text></view>
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
      salary: '10000', fundBase: '', fundRate: '5',
      flexBase: '4986', flexPen: '20', flexMed: '8',
      tSalary: '10000', tLabor: '0', tAuthor: '0', tRoyalty: '0',
      tBusiness: '0', tDividend: '0', tRent: '0', tTransfer: '0', tLuck: '0',
      yearSocial: '0', tChild: '0', tEdu: '0', tLoan: '0',
      tRentDeduction: '0', tElder: '0', tBaby: '0',
      result: null, flexResult: null, taxResult: null
    }
  },
  onLoad() {
    this.cfg = loadConfig()
    var inp = loadInput()
    this.salary = inp.salary || '10000'
    this.tSalary = inp.tSalary || '10000'
    this.fundRate = inp.fundRate || '5'
    this.fundBase = inp.fundBase || ''
    this.flexBase = inp.flexBase || '4986'
    this.flexPen = inp.flexPen || '20'
    this.flexMed = inp.flexMed || '8'
    this.tLabor = inp.tLabor || '0'
    this.tAuthor = inp.tAuthor || '0'
    this.tRoyalty = inp.tRoyalty || '0'
    this.tBusiness = inp.tBusiness || '0'
    this.tDividend = inp.tDividend || '0'
    this.tRent = inp.tRent || '0'
    this.tTransfer = inp.tTransfer || '0'
    this.tLuck = inp.tLuck || '0'
    this.tChild = inp.tChild || '0'
    this.tEdu = inp.tEdu || '0'
    this.tLoan = inp.tLoan || '0'
    this.tRentDeduction = inp.tRentDeduction || '0'
    this.tElder = inp.tElder || '0'
    this.tBaby = inp.tBaby || '0'
    this.calcAll()
  },
  onShow() {
    if (!this.cfg) this.cfg = loadConfig()
  },
  methods: {
    onSalary(e) {
      this.salary = e.detail.value
      this.tSalary = e.detail.value
      this.calcAll()
    },
    onFundBase(e) { this.fundBase = e.detail.value; this.calcAll() },
    onFundRate(e) { this.fundRate = e.detail.value; this.calcAll() },
    onFlexBase(e) { this.flexBase = e.detail.value; this.calcFlex() },
    onFlexPen(e) { this.flexPen = e.detail.value; this.calcFlex() },
    onFlexMed(e) { this.flexMed = e.detail.value; this.calcFlex() },
    onTSalary(e) { this.tSalary = e.detail.value; this.salary = e.detail.value; this.calcAll(); this.calcTax() },
    onTLabor(e) { this.tLabor = e.detail.value; this.calcTax() },
    onTAuthor(e) { this.tAuthor = e.detail.value; this.calcTax() },
    onTRoyalty(e) { this.tRoyalty = e.detail.value; this.calcTax() },
    onTBusiness(e) { this.tBusiness = e.detail.value; this.calcTax() },
    onTDividend(e) { this.tDividend = e.detail.value; this.calcTax() },
    onTRent(e) { this.tRent = e.detail.value; this.calcTax() },
    onTTransfer(e) { this.tTransfer = e.detail.value; this.calcTax() },
    onTLuck(e) { this.tLuck = e.detail.value; this.calcTax() },
    onTChild(e) { this.tChild = e.detail.value; this.calcTax() },
    onTEdu(e) { this.tEdu = e.detail.value; this.calcTax() },
    onTLoan(e) { this.tLoan = e.detail.value; this.calcTax() },
    onTRentDeduction(e) { this.tRentDeduction = e.detail.value; this.calcTax() },
    onTElder(e) { this.tElder = e.detail.value; this.calcTax() },
    onTBaby(e) { this.tBaby = e.detail.value; this.calcTax() },
    calcAll() {
      if (!this.cfg) return
      var s = parseFloat(this.salary) || 0
      var fb = parseFloat(this.fundBase) || s
      var fr = parseFloat(this.fundRate) || 5
      var social = calcSocial(s, fb, fr, this.cfg)
      this.yearSocial = fmt(social.yearPt)
      var tax = calcTax({
        salary: s * 12, labor: 0, author: 0, royalty: 0,
        business: 0, dividend: 0, rent: 0, rentDeduction: 0,
        transfer: 0, transferCost: 0, luck: 0, social: social.yearPt,
        childEducation: 0, continuingEducation: 0, housingLoan: 0,
        housingRent: 0, elderlySupport: 0, infantCare: 0
      }, this.cfg)
      this.result = {
        ep: fmt(social.ep), em: fmt(social.em), eu: fmt(social.eu),
        ei: fmt(social.ei), ef: fmt(social.ef),
        pp: fmt(social.pp), pm: fmt(social.pm), pu: fmt(social.pu), pf: fmt(social.pf),
        pt: fmt(social.pt), takeHome: fmt(calcTakeHome(s, social.pt, tax.monthlyTax)),
        monthlyTax: fmt(tax.monthlyTax)
      }
      this.save()
    },
    calcFlex() {
      if (!this.cfg) return
      var res = calcFlex(parseFloat(this.flexBase)||0, parseFloat(this.flexPen)||20, parseFloat(this.flexMed)||8, this.cfg)
      this.flexResult = { total: fmt(res.t), p: fmt(res.p), m: fmt(res.m) }
    },
    calcTax() {
      if (!this.cfg) return
      var s = parseFloat(this.tSalary) || 0
      var ys = parseFloat(this.yearSocial) || 0
      var tax = calcTax({
        salary: s * 12, labor: (parseFloat(this.tLabor)||0) * 12,
        author: (parseFloat(this.tAuthor)||0) * 12, royalty: (parseFloat(this.tRoyalty)||0) * 12,
        business: parseFloat(this.tBusiness)||0, dividend: parseFloat(this.tDividend)||0,
        rent: parseFloat(this.tRent)||0, rentDeduction: 0,
        transfer: parseFloat(this.tTransfer)||0, transferCost: 0,
        luck: parseFloat(this.tLuck)||0, social: ys,
        childEducation: (parseFloat(this.tChild)||0)*12, continuingEducation: (parseFloat(this.tEdu)||0)*12,
        housingLoan: (parseFloat(this.tLoan)||0)*12, housingRent: (parseFloat(this.tRentDeduction)||0)*12,
        elderlySupport: (parseFloat(this.tElder)||0)*12, infantCare: (parseFloat(this.tBaby)||0)*12
      }, this.cfg)
      this.taxResult = {
        totalTax: fmt(tax.totalTax), monthlyTax: fmt(tax.monthlyTax),
        taxableIncome: fmt(tax.comprehensiveTaxable),
        comprehensiveTax: fmt(tax.comprehensiveTax),
        businessTax: fmt(tax.businessTax), proportionalTax: fmt(tax.proportionalTax)
      }
    },
    save() {
      saveInput({
        salary: this.salary, fundBase: this.fundBase, fundRate: this.fundRate,
        flexBase: this.flexBase, flexPen: this.flexPen, flexMed: this.flexMed,
        tSalary: this.tSalary, tLabor: this.tLabor, tAuthor: this.tAuthor, tRoyalty: this.tRoyalty,
        tBusiness: this.tBusiness, tDividend: this.tDividend, tRent: this.tRent,
        tTransfer: this.tTransfer, tLuck: this.tLuck,
        tChild: this.tChild, tEdu: this.tEdu, tLoan: this.tLoan,
        tRentDeduction: this.tRentDeduction, tElder: this.tElder, tBaby: this.tBaby
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
