// 简化存储 - 单配置，自动保存

var KEY = 'itc_v4_config'

var DEFAULT = {
  // 社保参数
  social: {
    baseMin: 4986,
    baseMax: 38907,
    employerPension: 14,
    employerMedical: 7,
    employerUnemployment: 0.3,
    employerInjury: 0.2,
    employeePension: 8,
    employeeMedical: 2,
    employeeUnemployment: 0.5,
    fundMin: 5,
    fundMax: 12
  },
  // 灵活就业参数
  flexible: {
    baseMin: 4986,
    baseMax: 38907,
    pensionRate: 20,
    medicalRate: 8
  },
  // 个税参数
  tax: {
    basicDeduction: 60000,
    // 综合所得税率表
    brackets: [
      { min: 0, max: 36000, rate: 3, deduction: 0 },
      { min: 36000, max: 144000, rate: 10, deduction: 2520 },
      { min: 144000, max: 300000, rate: 20, deduction: 16920 },
      { min: 300000, max: 420000, rate: 25, deduction: 31920 },
      { min: 420000, max: 660000, rate: 30, deduction: 52920 },
      { min: 660000, max: 960000, rate: 35, deduction: 85920 },
      { min: 960000, max: null, rate: 45, deduction: 181920 }
    ],
    // 经营所得税率表
    businessBrackets: [
      { min: 0, max: 30000, rate: 5, deduction: 0 },
      { min: 30000, max: 90000, rate: 10, deduction: 1500 },
      { min: 90000, max: 300000, rate: 20, deduction: 10500 },
      { min: 300000, max: 500000, rate: 30, deduction: 40500 },
      { min: 500000, max: null, rate: 35, deduction: 65500 }
    ],
    // 专项附加扣除（元/月）
    special: {
      childEducation: 0,
      continuingEducation: 0,
      housingLoan: 0,
      housingRent: 0,
      elderlySupport: 0,
      infantCare: 0
    }
  }
}

// 加载配置
export function loadConfig() {
  try {
    var str = uni.getStorageSync(KEY)
    if (str) {
      var cfg = JSON.parse(str)
      // 合并默认值，确保所有字段存在
      return mergeConfig(DEFAULT, cfg)
    }
  } catch (e) {}
  return JSON.parse(JSON.stringify(DEFAULT))
}

// 保存配置
export function saveConfig(cfg) {
  try {
    uni.setStorageSync(KEY, JSON.stringify(cfg))
  } catch (e) {}
}

// 合并配置（保留用户修改，补充缺失字段）
function mergeConfig(defaultCfg, userCfg) {
  var result = {}
  for (var key in defaultCfg) {
    if (typeof defaultCfg[key] === 'object' && !Array.isArray(defaultCfg[key])) {
      result[key] = mergeConfig(defaultCfg[key], userCfg[key] || {})
    } else {
      result[key] = userCfg[key] !== undefined ? userCfg[key] : defaultCfg[key]
    }
  }
  return result
}

// 恢复默认
export function resetConfig() {
  saveConfig(JSON.parse(JSON.stringify(DEFAULT)))
}
