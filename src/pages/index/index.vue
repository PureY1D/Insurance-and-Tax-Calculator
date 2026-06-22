<template>
  <view class="page">
    <view class="top-tabs">
      <text :class="tab===0?'top-tab on':'top-tab'" @click="tab=0">社保缴费</text>
      <text :class="tab===1?'top-tab on':'top-tab'" @click="tab=1">个人所得税</text>
    </view>

    <!-- 社保页 -->
    <view v-show="tab===0" class="body">
      <view class="sub-tabs">
        <text :class="sub===0?'sub-tab on':'sub-tab'" @click="sub=0">企业职工</text>
        <text :class="sub===1?'sub-tab on':'sub-tab'" @click="sub=1">灵活就业</text>
      </view>

      <!-- 企业职工 -->
      <view v-show="sub===0">
        <view class="card">
          <text class="card-title">输入参数</text>
          <view class="row">
            <text class="lbl">税前工资</text>
            <input class="ipt" type="digit" :value="salary" @input="salary=$event.detail.value;doCalc();doTax();save()"/>
            <text class="ut">元/月</text>
          </view>
          <view class="check" @click="hasFund=!hasFund">
            <text class="chk">{{hasFund?'☑':'☐'}} 缴纳公积金</text>
          </view>
          <view v-if="hasFund">
            <view class="row">
              <text class="lbl">公积金基数</text>
              <input class="ipt" type="digit" :value="fundBase" @input="fundBase=$event.detail.value;doCalc();save()" placeholder="默认等于工资"/>
              <text class="ut">元</text>
            </view>
            <view class="row">
              <text class="lbl">公积金比例</text>
              <input class="ipt" type="digit" :value="fundRate" @input="fundRate=$event.detail.value;doCalc();save()"/>
              <text class="ut">%</text>
            </view>
            <text class="tip">💡 公积金基数范围：{{cfg.social.fundBaseMin}} ~ {{cfg.social.fundBaseMax}} 元</text>
          </view>
        </view>

        <view class="card">
          <text class="card-title">📖 政策说明</text>
          <view class="know">
            <text class="know-t">五险缴费比例</text>
            <text class="know-c">• 养老：单位14%，个人8%\n• 医疗：单位7%，个人2%\n• 失业：单位0.3%，个人0.5%\n• 工伤：单位0.2%，个人不缴</text>
          </view>
        </view>

        <view class="card">
          <text class="card-title">计算结果</text>
          <view class="result-main">
            <view class="result-item">
              <text class="result-lbl">到手工资</text>
              <text class="result-val">{{r.takeHome}}</text>
            </view>
            <view class="result-item">
              <text class="result-lbl">总扣除</text>
              <text class="result-val red">{{r.total}}</text>
            </view>
          </view>

          <text class="sec-title">扣除明细</text>
          <view class="det">
            <view class="det-row"><text class="det-lbl">养老保险 (8%)</text><text class="det-val">{{r.pp}}</text></view>
            <view class="det-row"><text class="det-lbl">医疗保险 (2%)</text><text class="det-val">{{r.pm}}</text></view>
            <view class="det-row"><text class="det-lbl">失业保险 (0.5%)</text><text class="det-val">{{r.pu}}</text></view>
            <view class="det-row sum"><text class="det-lbl">五险合计</text><text class="det-val">{{r.insTotal}}</text></view>
          </view>

          <view v-if="hasFund">
            <text class="sec-title">公积金</text>
            <view class="det">
              <view class="det-row"><text class="det-lbl">公积金 ({{r.fundRate}}%)</text><text class="det-val">{{r.pf}}</text></view>
            </view>
          </view>

          <view>
            <text class="sec-title">个人所得税</text>
            <view class="det">
              <view class="det-row"><text class="det-lbl">月度个税</text><text class="det-val">{{r.monthlyTax}}</text></view>
            </view>
          </view>
        </view>
      </view>

      <!-- 灵活就业 -->
      <view v-show="sub===1">
        <view class="card">
          <text class="card-title">灵活就业社保</text>
          <view class="row">
            <text class="lbl">缴费基数</text>
            <input class="ipt" type="digit" :value="flexBase" @input="flexBase=$event.detail.value;doFlex()"/>
            <text class="ut">元</text>
          </view>
          <view class="row">
            <text class="lbl">养老比例</text>
            <input class="ipt" type="digit" :value="flexPen" @input="flexPen=$event.detail.value;doFlex()"/>
            <text class="ut">%</text>
          </view>
          <view class="row">
            <text class="lbl">医保比例</text>
            <input class="ipt" type="digit" :value="flexMed" @input="flexMed=$event.detail.value;doFlex()"/>
            <text class="ut">%</text>
          </view>
        </view>

        <view class="card">
          <text class="card-title">📖 灵活就业说明</text>
          <view class="know">
            <text class="know-t">缴费规则</text>
            <text class="know-c">• 缴费基数：社平工资60%~300%\n• 养老保险：一般20%\n• 医疗保险：各地不同，8%~12%</text>
          </view>
        </view>

        <view class="card">
          <text class="card-title">计算结果</text>
          <view class="result-main">
            <view class="result-item">
              <text class="result-lbl">当月应缴</text>
              <text class="result-val">{{fr.t}}</text>
            </view>
          </view>
          <view class="det">
            <view class="det-row"><text class="det-lbl">养老保险</text><text class="det-val">{{fr.p}}</text></view>
            <view class="det-row"><text class="det-lbl">医疗保险</text><text class="det-val">{{fr.m}}</text></view>
          </view>
        </view>
      </view>
    </view>

    <!-- 个税页 -->
    <view v-show="tab===1" class="body">
      <view class="card">
        <text class="card-title">综合所得（元/月）</text>
        <view class="row"><text class="lbl">工资薪金</text><input class="ipt" type="digit" :value="salary" @input="salary=$event.detail.value;doCalc();doTax();save()"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">劳务报酬</text><input class="ipt" type="digit" :value="tLabor" @input="tLabor=$event.detail.value;doTax()"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">稿酬所得</text><input class="ipt" type="digit" :value="tAuthor" @input="tAuthor=$event.detail.value;doTax()"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">特许权使用费</text><input class="ipt" type="digit" :value="tRoyalty" @input="tRoyalty=$event.detail.value;doTax()"/><text class="ut">元</text></view>
      </view>

      <view class="card">
        <text class="card-title">其他所得（元/年）</text>
        <view class="row"><text class="lbl">经营所得</text><input class="ipt" type="digit" :value="tBusiness" @input="tBusiness=$event.detail.value;doTax()"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">利息股息红利</text><input class="ipt" type="digit" :value="tDividend" @input="tDividend=$event.detail.value;doTax()"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">财产租赁</text><input class="ipt" type="digit" :value="tRent" @input="tRent=$event.detail.value;doTax()"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">财产转让</text><input class="ipt" type="digit" :value="tTransfer" @input="tTransfer=$event.detail.value;doTax()"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">偶然所得</text><input class="ipt" type="digit" :value="tLuck" @input="tLuck=$event.detail.value;doTax()"/><text class="ut">元</text></view>
      </view>

      <view class="card">
        <text class="card-title">扣除项目</text>
        <view class="row"><text class="lbl">个人社保/年</text><text class="val">{{yearSocial}} 元</text><text class="sync">自动同步</text></view>
        <view class="row"><text class="lbl">子女教育/月</text><input class="ipt" type="digit" :value="tChild" @input="tChild=$event.detail.value;doTax()"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">继续教育/月</text><input class="ipt" type="digit" :value="tEdu" @input="tEdu=$event.detail.value;doTax()"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">住房贷款/月</text><input class="ipt" type="digit" :value="tLoan" @input="tLoan=$event.detail.value;doTax()"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">住房租金/月</text><input class="ipt" type="digit" :value="tRentDeduction" @input="tRentDeduction=$event.detail.value;doTax()"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">赡养老人/月</text><input class="ipt" type="digit" :value="tElder" @input="tElder=$event.detail.value;doTax()"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">婴幼儿照护/月</text><input class="ipt" type="digit" :value="tBaby" @input="tBaby=$event.detail.value;doTax()"/><text class="ut">元</text></view>
      </view>

      <view class="card">
        <text class="card-title">📖 计算流程</text>
        <view class="proc">
          <text>① 综合所得 = 工资 + 劳务×80% + 稿酬×80%×70% + 特许权×80%\n② 应纳税所得额 = 综合所得 - 60,000 - 个人社保 - 专项附加\n③ 查综合所得税率表\n④ 加上经营所得税\n⑤ 加上比例税率所得（20%）\n⑥ = 年度总个税</text>
        </view>
      </view>

      <view class="card">
        <text class="card-title">计算结果</text>
        <view class="result-main">
          <view class="result-item">
            <text class="result-lbl">年度总个税</text>
            <text class="result-val">{{tr.totalTax}}</text>
          </view>
          <view class="result-item">
            <text class="result-lbl">月均个税</text>
            <text class="result-val red">{{tr.monthlyTax}}</text>
          </view>
        </view>
        <view class="det">
          <view class="det-row"><text class="det-lbl">综合所得</text><text class="det-val">{{tr.comprehensiveIncome}}</text></view>
          <view class="det-row"><text class="det-lbl">扣除合计</text><text class="det-val">{{tr.comprehensiveDeduction}}</text></view>
          <view class="det-row"><text class="det-lbl">应纳税所得额</text><text class="det-val">{{tr.comprehensiveTaxable}}</text></view>
          <view class="det-row"><text class="det-lbl">综合所得税</text><text class="det-val">{{tr.comprehensiveTax}} ({{tr.comprehensiveBracket}})</text></view>
          <view class="det-row"><text class="det-lbl">经营所得税</text><text class="det-val">{{tr.businessTax}}</text></view>
          <view class="det-row"><text class="det-lbl">比例税率税</text><text class="det-val">{{tr.proportionalTax}}</text></view>
          <view class="det-row sum"><text class="det-lbl">年度总个税</text><text class="det-val hl">{{tr.totalTax}}</text></view>
        </view>
      </view>

      <view class="card">
        <text class="card-title">📖 政策参考</text>
        <view class="know">
          <text class="know-t">综合所得税率表</text>
          <view class="tbl">
            <view class="tr hd"><text class="td w1">级数</text><text class="td w2">应纳税所得额</text><text class="td w3">税率</text><text class="td w4">速算扣除</text></view>
            <view class="tr"><text class="td w1">1</text><text class="td w2">≤36,000</text><text class="td w3">3%</text><text class="td w4">0</text></view>
            <view class="tr"><text class="td w1">2</text><text class="td w2">36,000~144,000</text><text class="td w3">10%</text><text class="td w4">2,520</text></view>
            <view class="tr"><text class="td w1">3</text><text class="td w2">144,000~300,000</text><text class="td w3">20%</text><text class="td w4">16,920</text></view>
            <view class="tr"><text class="td w1">4</text><text class="td w2">300,000~420,000</text><text class="td w3">25%</text><text class="td w4">31,920</text></view>
            <view class="tr"><text class="td w1">5</text><text class="td w2">420,000~660,000</text><text class="td w3">30%</text><text class="td w4">52,920</text></view>
            <view class="tr"><text class="td w1">6</text><text class="td w2">660,000~960,000</text><text class="td w3">35%</text><text class="td w4">85,920</text></view>
            <view class="tr"><text class="td w1">7</text><text class="td w2">>960,000</text><text class="td w3">45%</text><text class="td w4">181,920</text></view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { loadCfg, loadInp, saveInp } from '../../utils/store'
import { calcInsurance, calcFund, calcFlex, calcTax, fmt } from '../../utils/calc'

function fix(n) { return Math.round(n * 100) / 100 }

export default {
  data: function() {
    return {
      tab: 0, sub: 0, cfg: null,
      hasFund: false, salary: '', fundBase: '', fundRate: '',
      flexBase: '', flexPen: '', flexMed: '',
      tLabor: '', tAuthor: '', tRoyalty: '',
      tBusiness: '', tDividend: '', tRent: '', tTransfer: '', tLuck: '',
      yearSocial: '0',
      tChild: '', tEdu: '', tLoan: '', tRentDeduction: '', tElder: '', tBaby: '',
      r: { takeHome: '0', total: '0', pp: '0', pm: '0', pu: '0', insTotal: '0', pf: '0', fundRate: '0', monthlyTax: '0' },
      fr: { t: '0', p: '0', m: '0' },
      tr: { totalTax: '0', monthlyTax: '0', comprehensiveIncome: '0', comprehensiveDeduction: '0', comprehensiveTaxable: '0', comprehensiveTax: '0', comprehensiveBracket: '', businessTax: '0', proportionalTax: '0' }
    }
  },
  watch: {
    hasFund: function() { this.doCalc() },
    salary: function() { this.doCalc(); this.doTax() },
    fundBase: function() { this.doCalc() },
    fundRate: function() { this.doCalc() },
    flexBase: function() { this.doFlex() },
    flexPen: function() { this.doFlex() },
    flexMed: function() { this.doFlex() },
    tLabor: function() { this.doTax() },
    tAuthor: function() { this.doTax() },
    tRoyalty: function() { this.doTax() },
    tBusiness: function() { this.doTax() },
    tDividend: function() { this.doTax() },
    tRent: function() { this.doTax() },
    tTransfer: function() { this.doTax() },
    tLuck: function() { this.doTax() },
    tChild: function() { this.doTax() },
    tEdu: function() { this.doTax() },
    tLoan: function() { this.doTax() },
    tRentDeduction: function() { this.doTax() },
    tElder: function() { this.doTax() },
    tBaby: function() { this.doTax() }
  },
  onLoad: function() { this.init() },
  onShow: function() { this.init() },
  methods: {
    init: function() {
      this.cfg = loadCfg()
      var inp = loadInp()
      this.hasFund = inp.hasFund || false
      this.salary = inp.salary || ''
      this.fundBase = inp.fundBase || ''
      this.fundRate = inp.fundRate || ''
      this.flexBase = inp.flexBase || ''
      this.flexPen = inp.flexPen || ''
      this.flexMed = inp.flexMed || ''
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
      this.doCalc()
      this.doFlex()
      this.doTax()
    },
    doCalc: function() {
      if (!this.cfg) return
      var s = parseFloat(this.salary) || 0
      var ins = calcInsurance(s, this.cfg)
      var pf = 0
      var fr = 0
      if (this.hasFund) {
        var fund = calcFund(s, parseFloat(this.fundBase) || 0, parseFloat(this.fundRate) || 0, this.cfg)
        pf = fund.pf
        fr = fmt(fund.rate * 100)
      }
      var total = fix(ins.total + pf)
      var yearSocial = fix(ins.yearTotal + fix(pf * 12))
      var taxInput = {
        salary: s * 12, labor: 0, author: 0, royalty: 0,
        business: 0, dividend: 0, rent: 0, rentDeduction: 0,
        transfer: 0, transferCost: 0, luck: 0,
        social: yearSocial, special: 0
      }
      var tax = calcTax(taxInput, this.cfg)
      var monthlyTax = tax.monthlyTax
      this.yearSocial = fmt(yearSocial)
      this.r = {
        takeHome: fmt(fix(s - total - monthlyTax)),
        total: fmt(fix(total + monthlyTax)),
        pp: fmt(ins.pp), pm: fmt(ins.pm), pu: fmt(ins.pu), insTotal: fmt(ins.total),
        pf: fmt(pf), fundRate: fr, monthlyTax: fmt(monthlyTax)
      }
      this.save()
    },
    doFlex: function() {
      if (!this.cfg) return
      var res = calcFlex(parseFloat(this.flexBase) || 0, parseFloat(this.flexPen) || 0, parseFloat(this.flexMed) || 0, this.cfg)
      this.fr = { t: fmt(res.t), p: fmt(res.p), m: fmt(res.m) }
    },
    doTax: function() {
      if (!this.cfg) return
      var s = parseFloat(this.salary) || 0
      var ys = parseFloat(this.yearSocial) || 0
      var sp = ((parseFloat(this.tChild) || 0) + (parseFloat(this.tEdu) || 0) + (parseFloat(this.tLoan) || 0) + (parseFloat(this.tRentDeduction) || 0) + (parseFloat(this.tElder) || 0) + (parseFloat(this.tBaby) || 0)) * 12
      var res = calcTax({
        salary: s * 12, labor: (parseFloat(this.tLabor) || 0) * 12,
        author: (parseFloat(this.tAuthor) || 0) * 12, royalty: (parseFloat(this.tRoyalty) || 0) * 12,
        business: parseFloat(this.tBusiness) || 0, dividend: parseFloat(this.tDividend) || 0,
        rent: parseFloat(this.tRent) || 0, rentDeduction: 0,
        transfer: parseFloat(this.tTransfer) || 0, transferCost: 0,
        luck: parseFloat(this.tLuck) || 0, social: ys, special: sp
      }, this.cfg)
      this.tr = {
        totalTax: fmt(res.totalTax), monthlyTax: fmt(res.monthlyTax),
        comprehensiveIncome: fmt(res.comprehensiveIncome),
        comprehensiveDeduction: fmt(res.comprehensiveDeduction),
        comprehensiveTaxable: fmt(res.comprehensiveTaxable),
        comprehensiveTax: fmt(res.comprehensiveTax),
        comprehensiveBracket: res.comprehensiveBracket,
        businessTax: fmt(res.businessTax), proportionalTax: fmt(res.proportionalTax)
      }
    },
    save: function() {
      saveInp({
        hasFund: this.hasFund,
        salary: this.salary, fundBase: this.fundBase, fundRate: this.fundRate,
        flexBase: this.flexBase, flexPen: this.flexPen, flexMed: this.flexMed,
        tLabor: this.tLabor, tAuthor: this.tAuthor, tRoyalty: this.tRoyalty,
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
.top-tabs{display:flex;background:#fff;border-bottom:2rpx solid #eee}
.top-tab{flex:1;height:90rpx;line-height:90rpx;text-align:center;font-size:30rpx;color:#666}
.top-tab.on{color:#2d8cf0;font-weight:bold;border-bottom:4rpx solid #2d8cf0}
.body{padding:20rpx}
.sub-tabs{display:flex;background:#fff;padding:16rpx;border-radius:12rpx;margin-bottom:20rpx}
.sub-tab{flex:1;height:72rpx;line-height:72rpx;text-align:center;font-size:28rpx;color:#666;background:#f0f2f5;border-radius:8rpx}
.sub-tab.on{background:#e8f3ff;color:#2d8cf0;font-weight:bold}
.card{background:#fff;border-radius:16rpx;padding:24rpx;margin-bottom:20rpx}
.card-title{display:block;font-size:32rpx;font-weight:bold;color:#333;margin-bottom:24rpx;text-align:center}
.row{display:flex;align-items:center;margin-bottom:20rpx}
.lbl{width:180rpx;font-size:28rpx;color:#666}
.ipt{flex:1;height:80rpx;border:2rpx solid #e5e5e5;border-radius:8rpx;padding:0 16rpx;font-size:28rpx}
.ut{font-size:24rpx;color:#999;margin-left:12rpx}
.val{flex:1;font-size:28rpx;color:#2d8cf0;font-weight:bold}
.sync{font-size:22rpx;color:#999;background:#f0f0f0;padding:4rpx 12rpx;border-radius:8rpx;margin-left:12rpx}
.tip{display:block;font-size:24rpx;color:#8c6e00;background:#fffbe6;border:2rpx solid #ffe58f;border-radius:8rpx;padding:16rpx;margin:16rpx 0}
.check{margin-bottom:20rpx}
.chk{font-size:28rpx;color:#2d8cf0}
.result-main{display:flex;justify-content:space-around;padding:20rpx 0;border-bottom:2rpx solid #f0f0f0;margin-bottom:20rpx}
.result-item{text-align:center}
.result-lbl{display:block;font-size:24rpx;color:#999;margin-bottom:10rpx}
.result-val{font-size:44rpx;font-weight:bold;color:#2d8cf0}
.result-val.red{color:#f56c6c}
.sec-title{display:block;font-size:28rpx;font-weight:bold;color:#333;margin:20rpx 0 16rpx}
.det{background:#f8f9fa;border-radius:8rpx;padding:16rpx;margin-bottom:16rpx}
.det-row{display:flex;justify-content:space-between;padding:8rpx 0;font-size:24rpx}
.det-row.sum{border-top:1rpx solid #e5e5e5;padding-top:12rpx;margin-top:8rpx}
.det-lbl{color:#666}
.det-val{color:#333}
.det-val.hl{color:#2d8cf0;font-weight:bold}
.know{background:#f0f7ff;border-radius:12rpx;padding:20rpx;margin:16rpx 0}
.know-t{display:block;font-size:26rpx;font-weight:bold;color:#2d8cf0;margin-bottom:12rpx}
.know-c{font-size:24rpx;color:#555;line-height:1.8}
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
