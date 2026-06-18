<template>
  <view class="page">
    <view class="tip"><text>💡 修改参数后自动保存</text></view>

    <!-- 社保参数 -->
    <view class="card">
      <text class="title">社保参数</text>
      <text class="st">缴费基数</text>
      <view class="r2">
        <view class="hf"><text class="ls">基数下限</text><input class="is" type="digit" :value="cfg.social.baseMin" @input="onSocialInput('baseMin',$event)"/></view>
        <view class="hf"><text class="ls">基数上限</text><input class="is" type="digit" :value="cfg.social.baseMax" @input="onSocialInput('baseMax',$event)"/></view>
      </view>

      <text class="st">单位缴费比例 (%)</text>
      <view class="r2">
        <view class="hf">
          <text class="ls">养老保险</text>
          <input class="is" type="digit" :value="cfg.social.employerPension" @input="onSocialInput('employerPension',$event)"/>
          <text class="hint">法定: 14%~16%</text>
        </view>
        <view class="hf">
          <text class="ls">医疗保险</text>
          <input class="is" type="digit" :value="cfg.social.employerMedical" @input="onSocialInput('employerMedical',$event)"/>
          <text class="hint">法定: 7%~9%</text>
        </view>
      </view>
      <view class="r2">
        <view class="hf">
          <text class="ls">失业保险</text>
          <input class="is" type="digit" :value="cfg.social.employerUnemployment" @input="onSocialInput('employerUnemployment',$event)"/>
          <text class="hint">法定: 0.3%~0.8%</text>
        </view>
        <view class="hf">
          <text class="ls">工伤保险</text>
          <input class="is" type="digit" :value="cfg.social.employerInjury" @input="onSocialInput('employerInjury',$event)"/>
          <text class="hint">法定: 0.2%~1.9%</text>
        </view>
      </view>

      <text class="st">个人缴费比例 (%)</text>
      <view class="r2">
        <view class="hf">
          <text class="ls">养老保险</text>
          <input class="is" type="digit" :value="cfg.social.employeePension" @input="onSocialInput('employeePension',$event)"/>
          <text class="hint">法定: 8%</text>
        </view>
        <view class="hf">
          <text class="ls">医疗保险</text>
          <input class="is" type="digit" :value="cfg.social.employeeMedical" @input="onSocialInput('employeeMedical',$event)"/>
          <text class="hint">法定: 2%</text>
        </view>
      </view>
      <view class="r2">
        <view class="hf">
          <text class="ls">失业保险</text>
          <input class="is" type="digit" :value="cfg.social.employeeUnemployment" @input="onSocialInput('employeeUnemployment',$event)"/>
          <text class="hint">法定: 0.5%</text>
        </view>
        <view class="hf"></view>
      </view>

      <text class="st">公积金 (%)</text>
      <view class="r2">
        <view class="hf">
          <text class="ls">最低比例</text>
          <input class="is" type="digit" :value="cfg.social.fundMin" @input="onSocialInput('fundMin',$event)"/>
          <text class="hint">法定: 5%</text>
        </view>
        <view class="hf">
          <text class="ls">最高比例</text>
          <input class="is" type="digit" :value="cfg.social.fundMax" @input="onSocialInput('fundMax',$event)"/>
          <text class="hint">法定: 12%</text>
        </view>
      </view>
    </view>

    <!-- 灵活就业参数 -->
    <view class="card">
      <text class="title">灵活就业参数</text>
      <text class="st">缴费基数范围</text>
      <view class="r2">
        <view class="hf"><text class="ls">基数下限</text><input class="is" type="digit" :value="cfg.flexible.baseMin" @input="onFlexibleInput('baseMin',$event)"/></view>
        <view class="hf"><text class="ls">基数上限</text><input class="is" type="digit" :value="cfg.flexible.baseMax" @input="onFlexibleInput('baseMax',$event)"/></view>
      </view>
      <text class="st">缴费比例 (%)</text>
      <view class="r2">
        <view class="hf">
          <text class="ls">养老保险</text>
          <input class="is" type="digit" :value="cfg.flexible.pensionRate" @input="onFlexibleInput('pensionRate',$event)"/>
          <text class="hint">法定: 20%~28%</text>
        </view>
        <view class="hf">
          <text class="ls">医疗保险</text>
          <input class="is" type="digit" :value="cfg.flexible.medicalRate" @input="onFlexibleInput('medicalRate',$event)"/>
          <text class="hint">法定: 8%~12%</text>
        </view>
      </view>
    </view>

    <!-- 个税参数 -->
    <view class="card">
      <text class="title">个税参数</text>
      <view class="row"><text class="lbl">基本减除费用</text><input class="ipt" type="digit" :value="cfg.tax.basicDeduction" @input="onTaxInput('basicDeduction',$event)"/><text class="ut">元/年</text></view>

      <text class="st">专项附加扣除标准 (元/月)</text>
      <view class="r2">
        <view class="hf"><text class="ls">子女教育</text><input class="is" type="digit" :value="cfg.tax.special.childEducation" @input="onSpecialInput('childEducation',$event)"/></view>
        <view class="hf"><text class="ls">继续教育</text><input class="is" type="digit" :value="cfg.tax.special.continuingEducation" @input="onSpecialInput('continuingEducation',$event)"/></view>
      </view>
      <view class="r2">
        <view class="hf"><text class="ls">住房贷款</text><input class="is" type="digit" :value="cfg.tax.special.housingLoan" @input="onSpecialInput('housingLoan',$event)"/></view>
        <view class="hf"><text class="ls">住房租金</text><input class="is" type="digit" :value="cfg.tax.special.housingRent" @input="onSpecialInput('housingRent',$event)"/></view>
      </view>
      <view class="r2">
        <view class="hf"><text class="ls">赡养老人</text><input class="is" type="digit" :value="cfg.tax.special.elderlySupport" @input="onSpecialInput('elderlySupport',$event)"/></view>
        <view class="hf"><text class="ls">婴幼儿照护</text><input class="is" type="digit" :value="cfg.tax.special.infantCare" @input="onSpecialInput('infantCare',$event)"/></view>
      </view>
    </view>

    <!-- 恢复默认 -->
    <view class="card">
      <view class="rst" @click="doReset"><text class="rst-t">🔄 恢复默认配置</text></view>
    </view>
  </view>
</template>

<script>
import { loadConfig, saveConfig, resetConfig } from '../../utils/store'

export default {
  data() { return { cfg: loadConfig() } },
  onLoad() { this.cfg = loadConfig() },
  onShow() { this.cfg = loadConfig() },
  methods: {
    onSocialInput(key, e) {
      this.cfg.social[key] = parseFloat(e.detail.value) || 0
      saveConfig(this.cfg)
    },
    onFlexibleInput(key, e) {
      this.cfg.flexible[key] = parseFloat(e.detail.value) || 0
      saveConfig(this.cfg)
    },
    onTaxInput(key, e) {
      this.cfg.tax[key] = parseFloat(e.detail.value) || 0
      saveConfig(this.cfg)
    },
    onSpecialInput(key, e) {
      this.cfg.tax.special[key] = parseFloat(e.detail.value) || 0
      saveConfig(this.cfg)
    },
    doReset() {
      var t = this
      uni.showModal({
        title: '恢复默认',
        content: '确定恢复默认配置？',
        success: function(r) {
          if (r.confirm) {
            resetConfig()
            t.cfg = loadConfig()
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
.title{display:block;font-size:30rpx;font-weight:bold;color:#333;margin-bottom:20rpx}
.st{display:block;font-size:26rpx;font-weight:bold;color:#666;margin:20rpx 0 12rpx;padding-left:12rpx;border-left:4rpx solid #2d8cf0}
.row{display:flex;align-items:center;margin-bottom:16rpx}
.lbl{width:180rpx;font-size:26rpx;color:#666;flex-shrink:0}
.ipt{flex:1;height:72rpx;border:2rpx solid #e5e5e5;border-radius:8rpx;padding:0 16rpx;font-size:28rpx}
.ut{font-size:22rpx;color:#999;margin-left:12rpx}
.r2{display:flex;gap:16rpx;margin-bottom:12rpx}
.hf{flex:1}
.ls{display:block;font-size:24rpx;color:#666;margin-bottom:8rpx}
.is{width:100%;height:64rpx;border:2rpx solid #e5e5e5;border-radius:8rpx;padding:0 12rpx;font-size:26rpx;box-sizing:border-box}
.hint{display:block;font-size:20rpx;color:#999;margin-top:4rpx}
.rst{background:#f56c6c;height:80rpx;border-radius:12rpx;display:flex;align-items:center;justify-content:center}
.rst-t{color:#fff;font-size:28rpx;font-weight:bold}
</style>
