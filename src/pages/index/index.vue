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
        <view class="row"><text class="lbl">税前工资</text><input class="ipt" type="digit" :value="salary" @input="salary=$event.detail.value"/><text class="ut">元/月</text></view>
        <view class="row"><text class="lbl">公积金比例</text><input class="ipt" type="digit" :value="fundRate" @input="fundRate=$event.detail.value"/><text class="ut">%</text></view>
      </view>

      <view v-if="sub===0" class="card">
        <text class="title">计算结果</text>
        <view class="big">
          <view class="bi"><text class="bl">到手工资</text><text class="bv">{{sr.home}}</text></view>
          <view class="bi"><text class="bl">个人扣除</text><text class="bv red">{{sr.pt}}</text></view>
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
        </view>
      </view>

      <!-- 灵活就业 -->
      <view v-if="sub===1" class="card">
        <text class="title">灵活就业社保</text>
        <view class="row"><text class="lbl">缴费基数</text><input class="ipt" type="digit" :value="flexBase" @input="flexBase=$event.detail.value"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">养老比例</text><input class="ipt" type="digit" :value="flexPen" @input="flexPen=$event.detail.value"/><text class="ut">%</text></view>
        <view class="row"><text class="lbl">医保比例</text><input class="ipt" type="digit" :value="flexMed" @input="flexMed=$event.detail.value"/><text class="ut">%</text></view>
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
        <text class="title">综合所得</text>
        <view class="row"><text class="lbl">工资薪金</text><input class="ipt" type="digit" :value="tSalary" @input="tSalary=$event.detail.value"/><text class="ut">元/月</text></view>
        <view class="row"><text class="lbl">劳务报酬</text><input class="ipt" type="digit" :value="tLabor" @input="tLabor=$event.detail.value"/><text class="ut">元/月</text></view>
        <view class="row"><text class="lbl">稿酬所得</text><input class="ipt" type="digit" :value="tAuthor" @input="tAuthor=$event.detail.value"/><text class="ut">元/月</text></view>
        <view class="row"><text class="lbl">特许权使用费</text><input class="ipt" type="digit" :value="tRoyalty" @input="tRoyalty=$event.detail.value"/><text class="ut">元/月</text></view>
      </view>

      <view class="card">
        <text class="title">其他所得</text>
        <view class="row"><text class="lbl">经营所得</text><input class="ipt" type="digit" :value="tBusiness" @input="tBusiness=$event.detail.value"/><text class="ut">元/年</text></view>
        <view class="row"><text class="lbl">利息股息红利</text><input class="ipt" type="digit" :value="tDividend" @input="tDividend=$event.detail.value"/><text class="ut">元/年</text></view>
        <view class="row"><text class="lbl">财产租赁</text><input class="ipt" type="digit" :value="tRent" @input="tRent=$event.detail.value"/><text class="ut">元/年</text></view>
        <view class="row"><text class="lbl">财产转让</text><input class="ipt" type="digit" :value="tTransfer" @input="tTransfer=$event.detail.value"/><text class="ut">元/年</text></view>
        <view class="row"><text class="lbl">偶然所得</text><input class="ipt" type="digit" :value="tLuck" @input="tLuck=$event.detail.value"/><text class="ut">元/年</text></view>
      </view>

      <view class="card">
        <text class="title">扣除项目</text>
        <view class="row"><text class="lbl">五险一金/年</text><input class="ipt" type="digit" :value="tSocial" @input="tSocial=$event.detail.value"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">子女教育/月</text><input class="ipt" type="digit" :value="tChild" @input="tChild=$event.detail.value"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">继续教育/月</text><input class="ipt" type="digit" :value="tEdu" @input="tEdu=$event.detail.value"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">住房贷款/月</text><input class="ipt" type="digit" :value="tLoan" @input="tLoan=$event.detail.value"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">住房租金/月</text><input class="ipt" type="digit" :value="tRentDeduction" @input="tRentDeduction=$event.detail.value"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">赡养老人/月</text><input class="ipt" type="digit" :value="tElder" @input="tElder=$event.detail.value"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">婴幼儿照护/月</text><input class="ipt" type="digit" :value="tBaby" @input="tBaby=$event.detail.value"/><text class="ut">元</text></view>
      </view>

      <view class="card">
        <text class="title">计算结果</text>
        <view class="big">
          <view class="bi"><text class="bl">年度总个税</text><text class="bv">{{tr.totalTax}}</text></view>
          <view class="bi"><text class="bl">月均个税</text><text class="bv red">{{tr.monthlyTax}}</text></view>
        </view>
        <view class="lst">
          <view class="li"><text>综合所得税</text><text>{{tr.comprehensiveTax}}</text></view>
          <view class="li"><text>经营所得税</text><text>{{tr.businessTax}}</text></view>
          <view class="li"><text>比例税率税</text><text>{{tr.proportionalTax}}</text></view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { loadConfig } from '../../utils/store'
import { calcSocial, calcFlex, calcTax, fmt } from '../../utils/calc'

export default {
  data() {
    return {
      tab: 0, sub: 0, cfg: null,
      // 社保输入
      salary: '10000', fundRate: '5',
      // 灵活就业输入
      flexBase: '4986', flexPen: '20', flexMed: '8',
      // 个税输入
      tSalary: '10000', tLabor: '0', tAuthor: '0', tRoyalty: '0',
      tBusiness: '0', tDividend: '0', tRent: '0', tTransfer: '0', tLuck: '0',
      tSocial: '0', tChildEdu: '0', tEdu: '0', tLoan: '0',
      tRentDeduction: '0', tElder: '0', tBaby: '0'
    }
  },
  computed: {
    sr() {
      if (!this.cfg) return {}
      var res = calcSocial(parseFloat(this.salary) || 0, parseFloat(this.fundRate) || 5, this.cfg)
      return {
        home: fmt(res.home), pt: fmt(res.pt),
        ep: fmt(res.ep), em: fmt(res.em), eu: fmt(res.eu), ei: fmt(res.ei), ef: fmt(res.ef),
        pp: fmt(res.pp), pm: fmt(res.pm), pu: fmt(res.pu), pf: fmt(res.pf)
      }
    },
    fr() {
      if (!this.cfg) return {}
      var res = calcFlex(
        parseFloat(this.flexBase) || 0,
        parseFloat(this.flexPen) || 20,
        parseFloat(this.flexMed) || 8,
        this.cfg
      )
      return { t: fmt(res.t), p: fmt(res.p), m: fmt(res.m) }
    },
    tr() {
      if (!this.cfg) return {}
      var res = calcTax({
        salary: (parseFloat(this.tSalary) || 0) * 12,
        labor: (parseFloat(this.tLabor) || 0) * 12,
        author: (parseFloat(this.tAuthor) || 0) * 12,
        royalty: (parseFloat(this.tRoyalty) || 0) * 12,
        business: parseFloat(this.tBusiness) || 0,
        dividend: parseFloat(this.tDividend) || 0,
        rent: parseFloat(this.tRent) || 0,
        rentDeduction: 0,
        transfer: parseFloat(this.tTransfer) || 0,
        transferCost: 0,
        luck: parseFloat(this.tLuck) || 0,
        social: parseFloat(this.tSocial) || 0,
        childEducation: (parseFloat(this.tChildEdu) || 0) * 12,
        continuingEducation: (parseFloat(this.tEdu) || 0) * 12,
        housingLoan: (parseFloat(this.tLoan) || 0) * 12,
        housingRent: (parseFloat(this.tRentDeduction) || 0) * 12,
        elderlySupport: (parseFloat(this.tElder) || 0) * 12,
        infantCare: (parseFloat(this.tBaby) || 0) * 12
      }, this.cfg)
      return {
        totalTax: fmt(res.totalTax),
        monthlyTax: fmt(res.monthlyTax),
        comprehensiveTax: fmt(res.comprehensiveTax),
        businessTax: fmt(res.businessTax),
        proportionalTax: fmt(res.proportionalTax)
      }
    }
  },
  onLoad() { this.cfg = loadConfig() },
  onShow() { this.cfg = loadConfig() }
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
.big{display:flex;justify-content:space-around;padding:20rpx 0;border-bottom:2rpx solid #f0f0f0;margin-bottom:20rpx}
.bi{text-align:center}
.bl{display:block;font-size:24rpx;color:#999;margin-bottom:10rpx}
.bv{font-size:44rpx;font-weight:bold;color:#2d8cf0}
.bv.red{color:#f56c6c}
.lst{padding:0 10rpx}
.li{display:flex;justify-content:space-between;padding:16rpx 0;border-bottom:1rpx solid #f5f5f5;font-size:28rpx}
.li text:first-child{color:#666}
.li text:last-child{color:#333}
</style>
