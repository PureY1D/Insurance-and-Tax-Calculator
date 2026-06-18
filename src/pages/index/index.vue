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
      <view v-show="sub===0" class="card">
        <text class="title">企业职工五险一金</text>
        <view class="row">
          <text class="lbl">税前工资</text>
          <input class="ipt" type="digit" :value="salary" @input="onSalaryInput"/>
          <text class="ut">元/月</text>
        </view>

        <view class="check-row" @click="toggleSocial">
          <view class="checkbox">
            <text v-if="hasSocial" class="checked">✓</text>
          </view>
          <text class="check-label">缴纳五险一金</text>
        </view>

        <view v-if="hasSocial">
          <view class="row">
            <text class="lbl">公积金基数</text>
            <input class="ipt" type="digit" :value="fundBase" @input="onFundBaseInput" placeholder="默认等于工资"/>
            <text class="ut">元</text>
          </view>
          <view class="row">
            <text class="lbl">公积金比例</text>
            <input class="ipt" type="digit" :value="fundRate" @input="onFundRateInput"/>
            <text class="ut">%</text>
          </view>
          <view class="info">
            <text>💡 社保基数范围：{{cfg.social.baseMin}} ~ {{cfg.social.baseMax}} 元</text>
          </view>
          <view class="info">
            <text>💡 公积金基数范围：{{cfg.social.fundBaseMin}} ~ {{cfg.social.fundBaseMax}} 元</text>
          </view>
        </view>
      </view>

      <!-- 企业职工结果 -->
      <view v-if="showResult" class="card">
        <text class="title">计算结果</text>
        <view class="big">
          <view class="bi"><text class="bl">到手工资</text><text class="bv">{{result.takeHome}}</text></view>
          <view class="bi"><text class="bl">个人社保</text><text class="bv">{{result.pt}}</text></view>
        </view>
        <view v-if="hasSocial" class="lst">
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

      <!-- 灵活就业 -->
      <view v-show="sub===1" class="card">
        <text class="title">灵活就业社保</text>
        <view class="row">
          <text class="lbl">缴费基数</text>
          <input class="ipt" type="digit" :value="flexBase" @input="onFlexBaseInput"/>
          <text class="ut">元</text>
        </view>
        <view class="row">
          <text class="lbl">养老比例</text>
          <input class="ipt" type="digit" :value="flexPen" @input="onFlexPenInput"/>
          <text class="ut">%</text>
        </view>
        <view class="row">
          <text class="lbl">医保比例</text>
          <input class="ipt" type="digit" :value="flexMed" @input="onFlexMedInput"/>
          <text class="ut">%</text>
        </view>
      </view>

      <!-- 灵活就业结果 -->
      <view v-if="showFlexResult && sub===1" class="card">
        <text class="title">灵活就业缴费结果</text>
        <view class="big"><view class="bi"><text class="bl">当月应缴</text><text class="bv">{{flexResult.total}}</text></view></view>
        <view class="lst">
          <view class="li"><text>养老保险</text><text>{{flexResult.p}}</text></view>
          <view class="li"><text>医疗保险</text><text>{{flexResult.m}}</text></view>
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

      <!-- 个税结果 -->
      <view v-if="showTaxResult" class="card">
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
  data: function() {
    return {
      tab: 0,
      sub: 0,
      cfg: null,
      hasSocial: false,
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
        takeHome: '0', pt: '0', ep: '0', em: '0', eu: '0', ei: '0', ef: '0',
        pp: '0', pm: '0', pu: '0', pf: '0', monthlyTax: '0'
      },
      flexResult: { total: '0', p: '0', m: '0' },
      taxResult: {
        totalTax: '0', monthlyTax: '0', taxableIncome: '0',
        comprehensiveTax: '0', businessTax: '0', proportionalTax: '0'
      }
    }
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
    loadData: function() {
      var inp = loadInput()
      var cfg = this.cfg
      this.hasSocial = inp.hasSocial === 'true'
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
    toggleSocial: function() {
      this.hasSocial = !this.hasSocial
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
    onFundBaseInput: function(e) {
      this.fundBase = e.detail.value
      this.doCalc()
      this.save()
    },
    onFundRateInput: function(e) {
      this.fundRate = e.detail.value
      this.doCalc()
      this.save()
    },
    onFlexBaseInput: function(e) {
      this.flexBase = e.detail.value
      this.doCalcFlex()
      this.save()
    },
    onFlexPenInput: function(e) {
      this.flexPen = e.detail.value
      this.doCalcFlex()
      this.save()
    },
    onFlexMedInput: function(e) {
      this.flexMed = e.detail.value
      this.doCalcFlex()
      this.save()
    },
    onTSalaryInput: function(e) {
      this.tSalary = e.detail.value
      this.salary = e.detail.value
      this.doCalc()
      this.doCalcTax()
      this.save()
    },
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
      if (this.hasSocial) {
        var fb = parseFloat(this.fundBase) || s
        var fr = parseFloat(this.fundRate) || this.cfg.social.fundRateMin
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
      } else {
        this.yearSocial = '0'
        this.result = {
          ep: '0.00', em: '0.00', eu: '0.00', ei: '0.00', ef: '0.00',
          pp: '0.00', pm: '0.00', pu: '0.00', pf: '0.00',
          pt: '0.00', takeHome: fmt(s), monthlyTax: '0.00'
        }
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
        taxableIncome: fmt(tax.comprehensiveTaxable),
        comprehensiveTax: fmt(tax.comprehensiveTax),
        businessTax: fmt(tax.businessTax), proportionalTax: fmt(tax.proportionalTax)
      }
      this.showTaxResult = true
    },
    save: function() {
      saveInput({
        hasSocial: String(this.hasSocial),
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
.li.hl{background:#fffbe6}
.li text:first-child{color:#666}
.li text:last-child{color:#333}
</style>
