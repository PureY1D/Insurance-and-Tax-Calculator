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
      <view v-show="sub===0" class="card">
        <text class="title">企业职工五险一金</text>
        <view class="row">
          <text class="lbl">税前工资</text>
          <input class="ipt" type="digit" v-model.number="salary"/>
          <text class="ut">元/月</text>
        </view>
        <view class="row">
          <text class="lbl">公积金基数</text>
          <input class="ipt" type="digit" v-model.number="fundBase" placeholder="默认等于工资"/>
          <text class="ut">元</text>
        </view>
        <view class="row">
          <text class="lbl">公积金比例</text>
          <input class="ipt" type="digit" v-model.number="fundRate"/>
          <text class="ut">%</text>
        </view>
      </view>

      <!-- 企业职工结果 -->
      <view v-if="showResult" class="card">
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

      <!-- 灵活就业 -->
      <view v-show="sub===1" class="card">
        <text class="title">灵活就业社保</text>
        <view class="row">
          <text class="lbl">缴费基数</text>
          <input class="ipt" type="digit" v-model.number="flexBase"/>
          <text class="ut">元</text>
        </view>
        <view class="row">
          <text class="lbl">养老比例</text>
          <input class="ipt" type="digit" v-model.number="flexPen"/>
          <text class="ut">%</text>
        </view>
        <view class="row">
          <text class="lbl">医保比例</text>
          <input class="ipt" type="digit" v-model.number="flexMed"/>
          <text class="ut">%</text>
        </view>
      </view>

      <!-- 灵活就业结果 -->
      <view v-if="showFlexResult" class="card">
        <text class="title">计算结果</text>
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
  data() {
    return {
      tab: 0, sub: 0, cfg: null,
      salary: 10000, fundBase: null, fundRate: 5,
      flexBase: 4986, flexPen: 20, flexMed: 8,
      tSalary: 10000, tLabor: 0, tAuthor: 0, tRoyalty: 0,
      tBusiness: 0, tDividend: 0, tRent: 0, tTransfer: 0, tLuck: 0,
      yearSocial: '0', tChild: 0, tEdu: 0, tLoan: 0,
      tRentDeduction: 0, tElder: 0, tBaby: 0,
      showResult: false, showFlexResult: false, showTaxResult: false,
      result: { takeHome: '0', pt: '0', ep: '0', em: '0', eu: '0', ei: '0', ef: '0', pp: '0', pm: '0', pu: '0', pf: '0', monthlyTax: '0' },
      flexResult: { total: '0', p: '0', m: '0' },
      taxResult: { totalTax: '0', monthlyTax: '0', taxableIncome: '0', comprehensiveTax: '0', businessTax: '0', proportionalTax: '0' },
      hasCalcSocial: false,
      hasCalcFlex: false,
      hasCalcTax: false
    }
  },
  watch: {
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
    this.doCalcTax()
  },
  onShow() {
    this.cfg = loadConfig()
    this.loadInputData()
    // 恢复计算结果
    if (this.hasCalcSocial) this.doCalc()
    if (this.hasCalcFlex) this.doCalcFlex()
    if (this.hasCalcTax) this.doCalcTax()
  },
  methods: {
    loadInputData() {
      var inp = loadInput()
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
      // 切换时恢复对应结果
      if (index === 0 && this.hasCalcSocial) {
        this.showResult = true
        this.showFlexResult = false
      } else if (index === 1 && this.hasCalcFlex) {
        this.showResult = false
        this.showFlexResult = true
      }
    },
    doCalc() {
      if (!this.cfg) return
      var s = this.salary || 0
      // 修复：正确处理 fundBase 为 0 或 null 的情况
      var fb = (this.fundBase !== null && this.fundBase !== undefined && this.fundBase !== '')
                ? this.fundBase : s
      var fr = this.fundRate || 5
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
      this.showResult = true
      this.hasCalcSocial = true
      this.save()
    },
    doCalcFlex() {
      if (!this.cfg) return
      var res = calcFlex(this.flexBase || 0, this.flexPen || 20, this.flexMed || 8, this.cfg)
      this.flexResult = { total: fmt(res.t), p: fmt(res.p), m: fmt(res.m) }
      this.showFlexResult = true
      this.hasCalcFlex = true
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
      this.taxResult = {
        totalTax: fmt(tax.totalTax), monthlyTax: fmt(tax.monthlyTax),
        taxableIncome: fmt(tax.comprehensiveTaxable),
        comprehensiveTax: fmt(tax.comprehensiveTax),
        businessTax: fmt(tax.businessTax), proportionalTax: fmt(tax.proportionalTax)
      }
      this.showTaxResult = true
      this.hasCalcTax = true
    },
    save() {
      saveInput({
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
