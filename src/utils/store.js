// 存储服务

var CFG_KEY = 'itc_cfg'
var INP_KEY = 'itc_inp'

// 默认配置（宁波2026）
var DEFAULT_CFG = {
  social: {
    baseMin: 4986, baseMax: 38907,
    employerPension: 14, employerMedical: 7, employerUnemployment: 0.3, employerInjury: 0.2,
    employeePension: 8, employeeMedical: 2, employeeUnemployment: 0.5,
    fundBaseMin: 2280, fundBaseMax: 36621,
    fundRateMin: 5, fundRateMax: 12
  },
  flexible: {
    baseMin: 4986, baseMax: 38907,
    pensionRate: 20, medicalRate: 8
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
    ]
  }
}

// 默认输入
var DEFAULT_INP = {
  hasFund: false,
  salary: '', fundBase: '', fundRate: '',
  flexBase: '', flexPen: '', flexMed: '',
  tLabor: '', tAuthor: '', tRoyalty: '',
  tBusiness: '', tDividend: '', tRent: '', tTransfer: '', tLuck: '',
  tChild: '', tEdu: '', tLoan: '', tRentDeduction: '', tElder: '', tBaby: ''
}

function get(key, def) {
  try { var s = uni.getStorageSync(key); if (s) return JSON.parse(s) } catch (e) {}
  return JSON.parse(JSON.stringify(def))
}

function set(key, val) {
  try { uni.setStorageSync(key, JSON.stringify(val)) } catch (e) {}
}

export function loadCfg() { return get(CFG_KEY, DEFAULT_CFG) }
export function saveCfg(cfg) { set(CFG_KEY, cfg) }
export function resetCfg() { set(CFG_KEY, DEFAULT_CFG) }

export function loadInp() { return get(INP_KEY, DEFAULT_INP) }
export function saveInp(inp) { set(INP_KEY, inp) }
