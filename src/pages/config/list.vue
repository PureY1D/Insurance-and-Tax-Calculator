<template>
  <view class="page">
    <text class="tip">💡 修改参数后自动保存</text>

    <!-- 社保参数 -->
    <view class="card">
      <text class="card-title">社保参数</text>
      <text class="sec-title">缴费基数</text>
      <view class="row2">
        <view class="half">
          <text class="lbl-sm">基数下限</text>
          <input class="ipt-sm" type="digit" :value="cfg.social.baseMin" @input="onSocialInput('baseMin',$event)"/>
        </view>
        <view class="half">
          <text class="lbl-sm">基数上限</text>
          <input class="ipt-sm" type="digit" :value="cfg.social.baseMax" @input="onSocialInput('baseMax',$event)"/>
        </view>
      </view>

      <text class="sec-title">单位缴费比例 (%)</text>
      <view class="row2">
        <view class="half">
          <text class="lbl-sm">养老保险</text>
          <input class="ipt-sm" type="digit" :value="cfg.social.employerPension" @input="onSocialInput('employerPension',$event)"/>
          <text class="hint">法定: 14%~16%</text>
        </view>
        <view class="half">
          <text class="lbl-sm">医疗保险</text>
          <input class="ipt-sm" type="digit" :value="cfg.social.employerMedical" @input="onSocialInput('employerMedical',$event)"/>
          <text class="hint">法定: 7%~9%</text>
        </view>
      </view>
      <view class="row2">
        <view class="half">
          <text class="lbl-sm">失业保险</text>
          <input class="ipt-sm" type="digit" :value="cfg.social.employerUnemployment" @input="onSocialInput('employerUnemployment',$event)"/>
          <text class="hint">法定: 0.3%~0.8%</text>
        </view>
        <view class="half">
          <text class="lbl-sm">工伤保险</text>
          <input class="ipt-sm" type="digit" :value="cfg.social.employerInjury" @input="onSocialInput('employerInjury',$event)"/>
          <text class="hint">法定: 0.2%~1.9%</text>
        </view>
      </view>

      <text class="sec-title">个人缴费比例 (%)</text>
      <view class="row2">
        <view class="half">
          <text class="lbl-sm">养老保险</text>
          <input class="ipt-sm" type="digit" :value="cfg.social.employeePension" @input="onSocialInput('employeePension',$event)"/>
          <text class="hint">法定: 8%</text>
        </view>
        <view class="half">
          <text class="lbl-sm">医疗保险</text>
          <input class="ipt-sm" type="digit" :value="cfg.social.employeeMedical" @input="onSocialInput('employeeMedical',$event)"/>
          <text class="hint">法定: 2%</text>
        </view>
      </view>
      <view class="row2">
        <view class="half">
          <text class="lbl-sm">失业保险</text>
          <input class="ipt-sm" type="digit" :value="cfg.social.employeeUnemployment" @input="onSocialInput('employeeUnemployment',$event)"/>
          <text class="hint">法定: 0.5%</text>
        </view>
        <view class="half"></view>
      </view>

      <text class="sec-title">公积金</text>
      <view class="row2">
        <view class="half">
          <text class="lbl-sm">基数下限</text>
          <input class="ipt-sm" type="digit" :value="cfg.social.fundBaseMin" @input="onSocialInput('fundBaseMin',$event)"/>
        </view>
        <view class="half">
          <text class="lbl-sm">基数上限</text>
          <input class="ipt-sm" type="digit" :value="cfg.social.fundBaseMax" @input="onSocialInput('fundBaseMax',$event)"/>
        </view>
      </view>
      <view class="row2">
        <view class="half">
          <text class="lbl-sm">最低比例</text>
          <input class="ipt-sm" type="digit" :value="cfg.social.fundRateMin" @input="onSocialInput('fundRateMin',$event)"/>
          <text class="hint">法定: 5%</text>
        </view>
        <view class="half">
          <text class="lbl-sm">最高比例</text>
          <input class="ipt-sm" type="digit" :value="cfg.social.fundRateMax" @input="onSocialInput('fundRateMax',$event)"/>
          <text class="hint">法定: 12%</text>
        </view>
      </view>
    </view>

    <!-- 灵活就业参数 -->
    <view class="card">
      <text class="card-title">灵活就业参数</text>
      <text class="sec-title">缴费基数范围</text>
      <view class="row2">
        <view class="half">
          <text class="lbl-sm">基数下限</text>
          <input class="ipt-sm" type="digit" :value="cfg.flexible.baseMin" @input="onFlexibleInput('baseMin',$event)"/>
        </view>
        <view class="half">
          <text class="lbl-sm">基数上限</text>
          <input class="ipt-sm" type="digit" :value="cfg.flexible.baseMax" @input="onFlexibleInput('baseMax',$event)"/>
        </view>
      </view>
      <text class="sec-title">缴费比例 (%)</text>
      <view class="row2">
        <view class="half">
          <text class="lbl-sm">养老保险</text>
          <input class="ipt-sm" type="digit" :value="cfg.flexible.pensionRate" @input="onFlexibleInput('pensionRate',$event)"/>
          <text class="hint">法定: 20%~28%</text>
        </view>
        <view class="half">
          <text class="lbl-sm">医疗保险</text>
          <input class="ipt-sm" type="digit" :value="cfg.flexible.medicalRate" @input="onFlexibleInput('medicalRate',$event)"/>
          <text class="hint">法定: 8%~12%</text>
        </view>
      </view>
    </view>

    <!-- 个税参数 -->
    <view class="card">
      <text class="card-title">个税参数</text>
      <view class="row">
        <text class="lbl">基本减除费用</text>
        <input class="ipt" type="digit" :value="cfg.tax.basicDeduction" @input="onTaxInput('basicDeduction',$event)"/>
        <text class="ut">元/年</text>
      </view>
    </view>

    <!-- 恢复默认 -->
    <view class="card">
      <view class="rst-btn" @click="doReset"><text class="rst-txt">🔄 恢复默认配置</text></view>
    </view>
  </view>
</template>

<script>
import { loadCfg, saveCfg, resetCfg } from '../../utils/store'

export default {
  data: function() {
    return { cfg: null }
  },
  onLoad: function() { this.cfg = loadCfg() },
  onShow: function() { this.cfg = loadCfg() },
  methods: {
    onSocialInput: function(key, e) {
      this.cfg.social[key] = parseFloat(e.detail.value) || 0
      saveCfg(this.cfg)
    },
    onFlexibleInput: function(key, e) {
      this.cfg.flexible[key] = parseFloat(e.detail.value) || 0
      saveCfg(this.cfg)
    },
    onTaxInput: function(key, e) {
      this.cfg.tax[key] = parseFloat(e.detail.value) || 0
      saveCfg(this.cfg)
    },
    doReset: function() {
      var that = this
      uni.showModal({
        title: '恢复默认',
        content: '确定恢复默认配置？',
        success: function(res) {
          if (res.confirm) {
            resetCfg()
            that.cfg = loadCfg()
            uni.showToast({ title: '已恢复', icon: 'success' })
          }
        }
      })
    }
  }
}
</script>

<style>
.page{min-height:100vh;background:#f5f7fa;padding:20rpx;padding-bottom:40rpx}
.tip{background:#e8f3ff;border-radius:8rpx;padding:16rpx;margin-bottom:20rpx;font-size:24rpx;color:#2d8cf0;text-align:center}
.card{background:#fff;border-radius:16rpx;padding:24rpx;margin-bottom:20rpx}
.card-title{display:block;font-size:30rpx;font-weight:bold;color:#333;margin-bottom:20rpx}
.sec-title{display:block;font-size:26rpx;font-weight:bold;color:#666;margin:20rpx 0 12rpx;padding-left:12rpx;border-left:4rpx solid #2d8cf0}
.row{display:flex;align-items:center;margin-bottom:16rpx}
.lbl{width:180rpx;font-size:26rpx;color:#666;flex-shrink:0}
.ipt{flex:1;height:72rpx;border:2rpx solid #e5e5e5;border-radius:8rpx;padding:0 16rpx;font-size:28rpx}
.ut{font-size:22rpx;color:#999;margin-left:12rpx}
.row2{display:flex;gap:16rpx;margin-bottom:12rpx}
.half{flex:1}
.lbl-sm{display:block;font-size:24rpx;color:#666;margin-bottom:8rpx}
.ipt-sm{width:100%;height:64rpx;border:2rpx solid #e5e5e5;border-radius:8rpx;padding:0 12rpx;font-size:26rpx;box-sizing:border-box}
.hint{display:block;font-size:20rpx;color:#999;margin-top:4rpx}
.rst-btn{background:#f56c6c;height:80rpx;border-radius:12rpx;display:flex;align-items:center;justify-content:center}
.rst-txt{color:#fff;font-size:28rpx;font-weight:bold}
</style>
