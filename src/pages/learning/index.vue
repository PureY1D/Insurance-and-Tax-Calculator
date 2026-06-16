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
          <view class="row"><text class="lbl">税前工资</text><input class="ipt" type="digit" :value="salary" @input="salary=$event.detail.value"/><text class="ut">元/月</text></view>
          <view class="row"><text class="lbl">公积金比例</text><input class="ipt" type="digit" :value="fundRate" @input="fundRate=$event.detail.value"/><text class="ut">%</text></view>
          <view class="info"><text>💡 基数范围：{{cfg.social.baseMin}} ~ {{cfg.social.baseMax}} 元</text></view>
        </view>

        <view class="card">
          <text class="title">📖 政策说明</text>
          <view class="know"><text class="kt">缴费基数规则</text><text class="kc">根据《社会保险法》第六十条：\n• 用人单位应按时足额缴纳社保费\n• 缴费基数为职工工资总额\n• 有上下限限制</text></view>
          <view class="know"><text class="kt">当前配置比例</text><text class="kc">单位：养老{{cfg.social.employerPension}}% 医疗{{cfg.social.employerMedical}}% 失业{{cfg.social.employerUnemployment}}% 工伤{{cfg.social.employerInjury}}%\n个人：养老{{cfg.social.employeePension}}% 医疗{{cfg.social.employeeMedical}}% 失业{{cfg.social.employeeUnemployment}}%</text></view>
        </view>

        <view class="card">
          <text class="title">计算结果</text>
          <view class="big">
            <view class="bi"><text class="bl">到手工资</text><text class="bv">{{sr.home}}</text></view>
            <view class="bi"><text class="bl">个人扣除</text><text class="bv red">{{sr.pt}}</text></view>
          </view>
          <text class="st">📝 详细计算过程</text>
          <view class="det">
            <text class="dh">【基数确定】</text>
            <text class="dc">输入工资: {{salary}} 元</text>
            <text class="dc">上下限: {{cfg.social.baseMin}} ~ {{cfg.social.baseMax}}</text>
            <text class="dhl">→ 实际基数: {{sr.base}} 元</text>
          </view>
          <view class="det">
            <text class="dh">【单位缴费】</text>
            <text class="dc">养老 = {{sr.base}} × {{cfg.social.employerPension}}% = {{sr.ep}} 元</text>
            <text class="dc">医疗 = {{sr.base}} × {{cfg.social.employerMedical}}% = {{sr.em}} 元</text>
            <text class="dc">失业 = {{sr.base}} × {{cfg.social.employerUnemployment}}% = {{sr.eu}} 元</text>
            <text class="dc">工伤 = {{sr.base}} × {{cfg.social.employerInjury}}% = {{sr.ei}} 元</text>
            <text class="dc">公积金 = {{sr.base}} × {{fundRate}}% = {{sr.ef}} 元</text>
            <text class="dhl">合计: {{sr.et}} 元</text>
          </view>
          <view class="det">
            <text class="dh">【个人缴费】</text>
            <text class="dc">养老 = {{sr.base}} × {{cfg.social.employeePension}}% = {{sr.pp}} 元</text>
            <text class="dc">医疗 = {{sr.base}} × {{cfg.social.employeeMedical}}% = {{sr.pm}} 元</text>
            <text class="dc">失业 = {{sr.base}} × {{cfg.social.employeeUnemployment}}% = {{sr.pu}} 元</text>
            <text class="dc">公积金 = {{sr.base}} × {{fundRate}}% = {{sr.pf}} 元</text>
            <text class="dhl">合计: {{sr.pt}} 元</text>
          </view>
          <view class="det">
            <text class="dh">【最终结果】</text>
            <text class="dc">税前工资: {{salary}} 元</text>
            <text class="dc">个人五险一金: -{{sr.pt}} 元</text>
            <text class="dhl">到手工资: {{sr.home}} 元</text>
          </view>
        </view>
      </view>

      <view v-if="sub===1">
        <view class="card">
          <text class="title">灵活就业社保</text>
          <view class="row"><text class="lbl">缴费基数</text><input class="ipt" type="digit" :value="flexBase" @input="flexBase=$event.detail.value"/><text class="ut">元</text></view>
          <view class="row"><text class="lbl">养老比例</text><input class="ipt" type="digit" :value="flexPen" @input="flexPen=$event.detail.value"/><text class="ut">%</text></view>
          <view class="row"><text class="lbl">医保比例</text><input class="ipt" type="digit" :value="flexMed" @input="flexMed=$event.detail.value"/><text class="ut">%</text></view>
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
        <view class="row"><text class="lbl">工资薪金</text><input class="ipt" type="digit" :value="tSalary" @input="tSalary=$event.detail.value"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">劳务报酬</text><input class="ipt" type="digit" :value="tLabor" @input="tLabor=$event.detail.value"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">稿酬所得</text><input class="ipt" type="digit" :value="tAuthor" @input="tAuthor=$event.detail.value"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">特许权使用费</text><input class="ipt" type="digit" :value="tRoyalty" @input="tRoyalty=$event.detail.value"/><text class="ut">元</text></view>
      </view>

      <view class="card">
        <text class="title">其他所得（元/年）</text>
        <view class="row"><text class="lbl">经营所得</text><input class="ipt" type="digit" :value="tBusiness" @input="tBusiness=$event.detail.value"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">利息股息红利</text><input class="ipt" type="digit" :value="tDividend" @input="tDividend=$event.detail.value"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">财产租赁</text><input class="ipt" type="digit" :value="tRent" @input="tRent=$event.detail.value"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">财产转让</text><input class="ipt" type="digit" :value="tTransfer" @input="tTransfer=$event.detail.value"/><text class="ut">元</text></view>
        <view class="row"><text class="lbl">偶然所得</text><input class="ipt" type="digit" :value="tLuck" @input="tLuck=$event.detail.value"/><text class="ut">元</text></view>
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
        <text class="title">📖 计算流程</text>
        <view class="proc"><text>① 汇总综合所得收入额\n  工资 + 劳务×80% + 稿酬×80%×70% + 特许权×80%\n② 减除费用60,000元/年\n③ 减除个人五险一金\n④ 减除专项附加扣除\n⑤ 得出应纳税所得额，查综合税率表\n⑥ 加上经营所得税\n⑦ 加上各项比例税率所得税\n⑧ 得到年度总个税</text></view>
      </view>

      <view class="card">
        <text class="title">计算结果</text>
        <view class="big">
          <view class="bi"><text class="bl">年度总个税</text><text class="bv">{{tr.totalTax}}</text></view>
          <view class="bi"><text class="bl">月均个税</text><text class="bv red">{{tr.monthlyTax}}</text></view>
        </view>

        <view class="det">
          <text class="dh">【综合所得计算】</text>
          <text class="dc">工资薪金: {{fmt((parseFloat(tSalary)||0)*12)}} 元</text>
          <text class="dc">劳务报酬: {{fmt((parseFloat(tLabor)||0)*12*0.8)}} 元 (×80%)</text>
          <text class="dc">稿酬所得: {{fmt((parseFloat(tAuthor)||0)*12*0.8*0.7)}} 元 (×80%×70%)</text>
          <text class="dc">特许权使用费: {{fmt((parseFloat(tRoyalty)||0)*12*0.8)}} 元 (×80%)</text>
          <text class="dhl">综合所得合计: {{tr.comprehensiveIncome}} 元</text>
        </view>

        <view class="det">
          <text class="dh">【扣除项目】</text>
          <text class="dc">基本减除: 60,000 元</text>
          <text class="dc">五险一金: {{fmt(parseFloat(tSocial)||0)}} 元</text>
          <text class="dc">专项附加扣除: {{fmt(specialTotal)}} 元</text>
          <text class="dhl">扣除合计: {{tr.comprehensiveDeduction}} 元</text>
        </view>

        <view class="det">
          <text class="dh">【综合所得税】</text>
          <text class="dc">应纳税所得额 = {{tr.comprehensiveIncome}} - {{tr.comprehensiveDeduction}} = {{tr.comprehensiveTaxable}} 元</text>
          <text class="dhl">综合所得税: {{tr.comprehensiveTax}} 元 (税率{{tr.comprehensiveBracket}})</text>
        </view>

        <view class="det">
          <text class="dh">【经营所得税】</text>
          <text class="dc">经营所得: {{fmt(parseFloat(tBusiness)||0)}} 元</text>
          <text class="dhl">经营所得税: {{tr.businessTax}} 元</text>
        </view>

        <view class="det">
          <text class="dh">【比例税率所得】</text>
          <text class="dc">利息股息红利: {{fmt(parseFloat(tDividend)||0)}} × 20% = {{tr.dividendTax}} 元</text>
          <text class="dc">财产租赁: {{fmt(parseFloat(tRent)||0)}} × 20% = {{tr.rentTax}} 元</text>
          <text class="dc">财产转让: {{fmt(parseFloat(tTransfer)||0)}} × 20% = {{tr.transferTax}} 元</text>
          <text class="dc">偶然所得: {{fmt(parseFloat(tLuck)||0)}} × 20% = {{tr.luckTax}} 元</text>
          <text class="dhl">比例税率税合计: {{tr.proportionalTax}} 元</text>
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
            <view class="tr"><text class="td w1">7</text><text class="td w2">>960,000</text><text class="td w3">45%</text><text class="td w4">181,920</text></view>
          </view>
        </view>
        <view class="know">
          <text class="kt">🏷️ 经营所得税率表</text>
          <view class="tbl">
            <view class="tr hd"><text class="td w1">级数</text><text class="td w2">应纳税所得额</text><text class="td w3">税率</text><text class="td w4">速算扣除</text></view>
            <view class="tr"><text class="td w1">1</text><text class="td w2">≤30,000</text><text class="td w3">5%</text><text class="td w4">0</text></view>
            <view class="tr"><text class="td w1">2</text><text class="td w2">30,000~90,000</text><text class="td w3">10%</text><text class="td w4">1,500</text></view>
            <view class="tr"><text class="td w1">3</text><text class="td w2">90,000~300,000</text><text class="td w3">20%</text><text class="td w4">10,500</text></view>
            <view class="tr"><text class="td w1">4</text><text class="td w2">300,000~500,000</text><text class="td w3">30%</text><text class="td w4">40,500</text></view>
            <view class="tr"><text class="td w1">5</text><text class="td w2">>500,000</text><text class="td w3">35%</text><text class="td w4">65,500</text></view>
          </view>
        </view>
        <view class="know">
          <text class="kt">🏷️ 比例税率所得 (20%)</text>
          <text class="kc">• 利息、股息、红利所得\n• 财产租赁所得\n• 财产转让所得\n• 偶然所得</text>
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
      salary: '10000', fundRate: '5',
      flexBase: '4986', flexPen: '20', flexMed: '8',
      tSalary: '10000', tLabor: '0', tAuthor: '0', tRoyalty: '0',
      tBusiness: '0', tDividend: '0', tRent: '0', tTransfer: '0', tLuck: '0',
      tSocial: '0', tChild: '0', tEdu: '0', tLoan: '0',
      tRentDeduction: '0', tElder: '0', tBaby: '0'
    }
  },
  computed: {
    specialTotal() {
      return ((parseFloat(this.tChild)||0) + (parseFloat(this.tEdu)||0) +
        (parseFloat(this.tLoan)||0) + (parseFloat(this.tRentDeduction)||0) +
        (parseFloat(this.tElder)||0) + (parseFloat(this.tBaby)||0)) * 12
    },
    sr() {
      if (!this.cfg) return {}
      var res = calcSocial(parseFloat(this.salary) || 0, parseFloat(this.fundRate) || 5, this.cfg)
      return {
        base: fmt(res.base), home: fmt(res.home), pt: fmt(res.pt),
        ep: fmt(res.ep), em: fmt(res.em), eu: fmt(res.eu), ei: fmt(res.ei), ef: fmt(res.ef), et: fmt(res.et),
        pp: fmt(res.pp), pm: fmt(res.pm), pu: fmt(res.pu), pf: fmt(res.pf)
      }
    },
    fr() {
      if (!this.cfg) return {}
      var res = calcFlex(parseFloat(this.flexBase)||0, parseFloat(this.flexPen)||20, parseFloat(this.flexMed)||8, this.cfg)
      return { t: fmt(res.t), p: fmt(res.p), m: fmt(res.m) }
    },
    tr() {
      if (!this.cfg) return {}
      var res = calcTax({
        salary: (parseFloat(this.tSalary)||0)*12, labor: (parseFloat(this.tLabor)||0)*12,
        author: (parseFloat(this.tAuthor)||0)*12, royalty: (parseFloat(this.tRoyalty)||0)*12,
        business: parseFloat(this.tBusiness)||0, dividend: parseFloat(this.tDividend)||0,
        rent: parseFloat(this.tRent)||0, rentDeduction: 0,
        transfer: parseFloat(this.tTransfer)||0, transferCost: 0,
        luck: parseFloat(this.tLuck)||0, social: parseFloat(this.tSocial)||0,
        childEducation: (parseFloat(this.tChild)||0)*12, continuingEducation: (parseFloat(this.tEdu)||0)*12,
        housingLoan: (parseFloat(this.tLoan)||0)*12, housingRent: (parseFloat(this.tRentDeduction)||0)*12,
        elderlySupport: (parseFloat(this.tElder)||0)*12, infantCare: (parseFloat(this.tBaby)||0)*12
      }, this.cfg)
      return {
        totalTax: fmt(res.totalTax), monthlyTax: fmt(res.monthlyTax),
        comprehensiveIncome: fmt(res.comprehensiveIncome), comprehensiveDeduction: fmt(res.comprehensiveDeduction),
        comprehensiveTaxable: fmt(res.comprehensiveTaxable), comprehensiveTax: fmt(res.comprehensiveTax),
        comprehensiveBracket: res.comprehensiveBracket,
        businessTax: fmt(res.businessTax),
        dividendTax: fmt(res.dividendTax), rentTax: fmt(res.rentTax),
        transferTax: fmt(res.transferTax), luckTax: fmt(res.luckTax),
        proportionalTax: fmt(res.proportionalTax)
      }
    }
  },
  onLoad() { this.cfg = loadConfig() },
  onShow() { this.cfg = loadConfig() },
  methods: { fmt: fmt }
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
