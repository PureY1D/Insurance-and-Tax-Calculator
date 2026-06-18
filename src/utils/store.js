// 存储服务 - 配置 + 输入数据缓存

var CONFIG_KEY = 'itc_v4_config'
var INPUT_KEY = 'itc_v4_input'

// 默认配置（宁波2024）
var DEFAULT_CONFIG = {
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
  flexible: {
    baseMin: 4986,
    baseMax: 38907,
    pensionRate: 20,
    medicalRate: 8
  },
  tax: {
    basicDeduction: 60000,
    brackets: [
      { min: 0, max: 36000, rate: 3, deduction: 0 },
      { min: 36000, max: 144000, rate: 10, deduction: 2520 },
      { min: 144000, max: 300000, rate: 20, deduction: 16920 },
      { min: 300000, max: 420000, rate: 25, deduction: 31920 },
      { min: 420000, max: 660000, rate: 30, deduction: 52920 },
      { min: 660000, max: 960000, rate: 35, deduction: 85920 },
      { min: 960000, max: null, rate: 45, deduction: 181920 }
    ],
    businessBrackets: [
      { min: 0, max: 30000, rate: 5, deduction: 0 },
      { min: 30000, max: 90000, rate: 10, deduction: 1500 },
      { min: 90000, max: 300000, rate: 20, deduction: 10500 },
      { min: 300000, max: 500000, rate: 30, deduction: 40500 },
      { min: 500000, max: null, rate: 35, deduction: 65500 }
    ],
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

// 默认输入数据
var DEFAULT_INPUT = {
  // 社保页输入
  salary: '10000',
  fundBase: '',      // 空表示等于工资
  fundRate: '5',
  // 灵活就业
  flexBase: '4986',
  flexPen: '20',
  flexMed: '8',
  // 个税页输入
  tSalary: '10000',  // 与社保页工资同步
  tLabor: '0',
  tAuthor: '0',
  tRoyalty: '0',
  tBusiness: '0',
  tDividend: '0',
  tRent: '0',
  tTransfer: '0',
  tLuck: '0',
  tChild: '0',
  tEdu: '0',
  tLoan: '0',
  tRentDeduction: '0',
  tElder: '0',
  tBaby: '0'
}

// 配置相关
export function loadConfig() {
  try {
    var str = uni.getStorageSync(CONFIG_KEY)
    if (str) return mergeConfig(DEFAULT_CONFIG, JSON.parse(str))
  } catch (e) {}
  return JSON.parse(JSON.stringify(DEFAULT_CONFIG))
}

export function saveConfig(cfg) {
  try { uni.setStorageSync(CONFIG_KEY, JSON.stringify(cfg)) } catch (e) {}
}

export function resetConfig() {
  saveConfig(JSON.parse(JSON.stringify(DEFAULT_CONFIG)))
}

// 输入数据相关
export function loadInput() {
  try {
    var str = uni.getStorageSync(INPUT_KEY)
    if (str) return JSON.parse(str)
  } catch (e) {}
  return JSON.parse(JSON.stringify(DEFAULT_INPUT))
}

export function saveInput(input) {
  try { uni.setStorageSync(INPUT_KEY, JSON.stringify(input)) } catch (e) {}
}

// 合并配置
function mergeConfig(def, user) {
  var result = {}
  for (var key in def) {
    if (typeof def[key] === 'object' && !Array.isArray(def[key])) {
      result[key] = mergeConfig(def[key], user[key] || {})
    } else {
      result[key] = user[key] !== undefined ? user[key] : def[key]
    }
  }
  return result
}
