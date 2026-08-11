// This code adapted from Nic Bradley's R20 test framework from the WFRP4e official sheet.
import { vi } from 'vitest';
import _ from 'underscore';
import translation from './translation.json' assert {type:'json'}

/**
 * @namespace {object} mock20
 */
/**
 * @memberof mock20
 * @var
 * A mock environment variable for keeping track of triggers, other character information, and predefined query results.
 * @property {array} triggers - The triggers that have been registered by `on`
 * @property {object} queryResponses - Pre defined results you want the roll parser to use for a given roll query. Keys in the objects are roll query prompts. Values are what the user input should be for that query.
 */
const environment = {
  attributes:{"sheet_version":"0","sr_anarchy_2e_tab":"nav-tabs-sr-anarchy-2e--character","streetname":"","concept":"","strength":"0","agility":"0","logic":"0","willpower":"0","charisma":"0","edge":"0","armor":"0","protection":"0","firewall":"0","lightnum":"0","seriousnum":"0","incapnum":"0","light1":0,"light2":0,"light3":0,"serious1":0,"serious2":0,"incap1":0,"armor_threshold":"Armor","light_threshold":"0","serious_threshold":"0","incap_threshold":"0","prot_threshold":"Protection","light_prot":"0","serious_prot":"0","incap_prot":"0","matrix_threshold":"Matrix","light_matrix":"0","serious_matrix":"0","incap_matrix":"0","athleticss":"0","athleticss_bonus":"0","athleticss_total":"0","athleticss_rr":"0","athleticsa":"0","athleticsa_bonus":"0","athleticsa_total":"0","athleticsa_rr":"0","closecombata":"0","closecombata_bonus":"0","closecombata_total":"0","closecombata_rr":"0","closecombatw":"0","closecombatw_bonus":"0","closecombatw_total":"0","closecombatw_rr":"0","conjuringl":"0","conjuringl_bonus":"0","conjuringl_total":"0","conjuringl_rr":"0","conjuringc":"0","conjuringc_bonus":"0","conjuringc_total":"0","conjuringc_rr":"0","crackingl":"0","crackingl_bonus":"0","crackingl_total":"0","crackingl_rr":"0","crackingw":"0","crackingw_bonus":"0","crackingw_total":"0","crackingw_rr":"0","electronicsl":"0","electronicsl_bonus":"0","electronicsl_total":"0","electronicsl_rr":"0","engineeringl":"0","engineeringl_bonus":"0","engineeringl_total":"0","engineeringl_rr":"0","influencec":"0","influencec_bonus":"0","influencec_total":"0","influencec_rr":"0","networkc":"0","networkc_bonus":"0","networkc_total":"0","networkc_rr":"0","perceptionl":"0","perceptionl_bonus":"0","perceptionl_total":"0","perceptionl_rr":"0","pilotinga":"0","pilotinga_bonus":"0","pilotinga_total":"0","pilotinga_rr":"0","rangeda":"0","rangeda_bonus":"0","rangeda_total":"0","rangeda_rr":"0","sorceryw":"0","sorceryw_bonus":"0","sorceryw_total":"0","sorceryw_rr":"0","stealtha":"0","stealtha_bonus":"0","stealtha_total":"0","stealtha_rr":"0","stealthl":"0","stealthl_bonus":"0","stealthl_total":"0","stealthl_rr":"0","survivall":"0","survivall_bonus":"0","survivall_total":"0","survivall_rr":"0","survivalc":"0","survivalc_bonus":"0","survivalc_total":"0","survivalc_rr":"0","survivalw":"0","survivalw_bonus":"0","survivalw_total":"0","survivalw_rr":"0","specializations":"","knowledge":"","logo":"","keywords":"","dispositions":"","cues":"","risk_rr_0":"0","risk_rr_0_low":"1 die","risk_rr_0_normal":"2 dice","risk_rr_0_high":"4 dice","risk_rr_0_extreme":"6+ dice","risk_rr_1":"1","risk_rr_1_low":"3 dice","risk_rr_1_normal":"5 dice","risk_rr_1_high":"7 dice","risk_rr_1_extreme":"10+ dice","risk_rr_2":"2","risk_rr_2_low":"5 dice","risk_rr_2_normal":"8 dice","risk_rr_2_high":"11 dice","risk_rr_2_extreme":"13+ dice","risk_rr_3":"3","risk_rr_3_low":"8 dice","risk_rr_3_normal":"12 dice","risk_rr_3_high":"15 dice","risk_rr_3_extreme":"N/A","template_start":"@{whisper}&{template:sr-anarchy-2e} {{character_name=@{character_name}}} {{character_id=@{character_id}}}"},
  triggers: [],
  translation,
  otherCharacters: {
    // Attribute information of other test characters indexed by character name
  },
  queryResponses:{
    // object defining which value to use for roll queries, indexed by prompt text
  }
};
global.environment = environment;

const on = vi.fn((trigger, func) => {
  environment.triggers.push({ trigger, func });
});
global.on = on;
const getAttrs = vi.fn((query, callback) => {
  let values = {};
  for (const attr of query) {
    if (attr in environment.attributes) values[attr] = environment.attributes[attr];
  }
  if (typeof callback === "function") callback(values);
});
global.getAttrs = getAttrs;
const setAttrs = vi.fn((submit, params, callback) => {
  if (!callback && typeof params === "function") callback = params;
  for (const attr in submit) {
    environment.attributes[attr] = submit[attr];
  }
  if (typeof callback === "function") callback();
});
global.setAttrs = setAttrs;
const getSectionIDs = vi.fn((section, callback) => {
  const ids = [];
  const sectionName = section.indexOf("repeating_") === 0 ? section : `repeating_${section}`;
  const attributes = environment.attributes;
  for (const attr in attributes) {
    if (attr.indexOf(sectionName) === 0) ids.push(attr.split("_")[2]);
  }
  const idMap = [...new Set(ids)];
  if (typeof callback === "function") callback(idMap);
});
global.getSectionIDs = getSectionIDs;
const getSectionIDsSync = vi.fn((section) => {
  const ids = [];
  const sectionName = section.indexOf("repeating_") === 0 ? section : `repeating_${section}`;
  const attributes = environment.attributes;
  for (const attr in attributes) {
    if (attr.indexOf(sectionName) === 0) ids.push(attr.split("_")[2]);
  }
  const idMap = [...new Set(ids)];
  return idMap;
});
global.getSectionIDsSync = getSectionIDsSync;
const removeRepeatingRow = vi.fn((id) => {
  const attributes = environment.attributes;
  for (const attr in attributes) {
    if (attr.indexOf(id) > -1) delete environment.attributes[attr];
  }
});
global.removeRepeatingRow = removeRepeatingRow;
const setSectionOrder = vi.fn((section, order, callback) => {
  const sectionName = section.indexOf('repeating_') === 0 ? section : `repeating_${section}`;
  environment.attributes[`_reporder_${sectionName}`] = Array.isArray(order) ? order.join(',') : order;
  if (typeof callback === 'function') callback();
});
global.setSectionOrder = setSectionOrder;
const getCompendiumPage = vi.fn((request, callback) => {
  const pages = compendiumData;
  if (!pages)
    throw new Error(
      "Tried to use getCompendiumPage, but testing environment does not contain compendiumData."
    );
  if (typeof request === "string") {
    const [category, pageName] = request.split(":");
    const response = {
      Name: pageName,
      Category: category,
      data: {},
    };
    if (pages[request]) response.data = pages[request].data;
    if (typeof callback === "function") callback(response);
  } else if (Array.isArray(request)) {
    const pageArray = [];
    for (const page of request) {
      if (pages[request] && pages[request].Category === category) pageArray.push(pages[pageName]);
    }
    if (typeof callback === "function") callback(pageArray);
  }
});
global.getCompendiumPage = getCompendiumPage;
const generateUUID = vi.fn(() => {
  var a = 0,
    b = [];
  return (function () {
    var c = new Date().getTime() + 0,
      d = c === a;
    a = c;
    for (var e = Array(8), f = 7; 0 <= f; f--)
      (e[f] = "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(c % 64)),
      (c = Math.floor(c / 64));
    c = e.join("");
    if (d) {
      for (f = 11; 0 <= f && 63 === b[f]; f--) b[f] = 0;
      b[f]++;
    } else for (f = 0; 12 > f; f++) b[f] = Math.floor(64 * Math.random());
    for (f = 0; 12 > f; f++)
      c += "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(b[f]);
    return c.replace(/_/g, "z");
  })();
});
global.generateUUID = generateUUID;
const generateRowID = vi.fn(() => {
  return generateUUID().replace(/_/g, "Z");
});
global.generateRowID = generateRowID;
const simulateEvent = vi.fn((event) => {
  environment.triggers.forEach((trigger) => {
    const splitTriggers = trigger.trigger.split(" ") || [trigger.trigger];
    splitTriggers.forEach((singleTrigger) => {
      if (event === singleTrigger) {
        trigger.func({
          sourceAttribute: "test",
        });
      }
    });
  });
});
global.simulateEvent = simulateEvent;
const getTranslationByKey = vi.fn((key) => environment.translation?.[key] || false);
global.getTranslationByKey = getTranslationByKey;
// Roll Handlingglobal.getTranslationByKey = getTranslationByKey;

const extractRollTemplate = (rollString) => {
  const rollTemplate = rollString.match(/&\{template:(.*?)\}/)?.[1];
  environment.attributes.__rolltemplate = rollTemplate;
};

const cleanRollElements = (value) => {
  const cleanText = value
    .replace(/\{\{|\}}(?=$|\s|\{)/g, "")
    .replace(/=/,'===SPLITHERE===');
  const splitText = cleanText.split("===SPLITHERE===");
  return splitText;
};

const extractRollElements = (rollString) => {
  const rollElements = rollString.match(/\{\{(.*?)\}{2,}(?=$|\s|\{)/g);
  if (!rollElements || rollElements.length < 1) return {}
  return  Object.fromEntries(rollElements.map(cleanRollElements));
};

const getExpression = (element) => element.replace(/(\[\[|\]\])/gi, "");

const getDiceOrHalf = (size) => {
  const diceStack = environment.diceStack;
  if (!diceStack?.[size] || diceStack[size].length < 0) return size / 2;
  return environment.diceStack[size].pop();
};

const getDiceRolls = (expression) => {
  const rolls = expression.match(/([0-9]+)?d([0-9]+)/gi);
  if (!rolls) return [];
  const allRolls = [];
  rolls.forEach((roll) => {
    const [number, size] = roll.split(/d/i);
    for (let i = 1; i <= number; i++) {
      const dice = getDiceOrHalf(size);
      allRolls.push(dice);
    }
  });
  return allRolls;
};

const calculateResult = (startExpression, dice) => {
  let expression = startExpression.replace(/\[.+?\]/g,'')

  const rolls = expression.match(/([0-9]+)?d([0-9]+)/gi);
  if (!rolls) return eval(expression);
  rolls.forEach((roll, index) => {
    const [number, size] = roll.split(/d/i);
    let total = 0;
    for (let i = 1; i <= number; i++) {
      total += +dice.shift();
    }
    expression = expression.replace(/([0-9]+d[0-9]+([+\-*/][0-9]+)?)(.*?)$/gi, "$1");
    const regex = new RegExp(roll, "gi");
    expression = expression.replace(regex, total);
  });

  return eval(expression);
};

const replaceAttributes = (element) => {
  const test = /@\{(.*?)\}/i;
  while (test.test(element)) {
    element = element.replace(/@\{(.*?)\}/gi, (sub, ...args) => {
      const attributeName = args[0];
      const attributeValue = environment.attributes[attributeName];
      const attributeExists = typeof attributeValue !== "undefined";
      const possibleAttributes = Object.keys(environment.attributes);
      if (attributeExists) return attributeValue;
      else
        throw new Error(
          `Roll called ${sub} but no corresponding attribute "${attributeName}" was found. Attributes are: ${possibleAttributes.join(
            ", "
          )}`
        );
    });
  }
  return element;
};

const replaceQueries = (element) => {
  return element.replace(/\?\{(.+?)[|}]([^}]+?\})?/g,(match,p,a) => {
    a = a?.split(/\s*\|\s*/) || [];
    return environment.queryResponses[p] || a[0] || '';
  });
};

const calculateRollResult = (rollElements) => {
  const results = {};
  for (const key in rollElements) {
    const element = rollElements[key];
    if (element.indexOf("[[") === -1) continue;
    const attributeFilled = replaceAttributes(element);
    const queryAnswered = replaceQueries(attributeFilled);
    const expression = getExpression(queryAnswered);
    const dice = getDiceRolls(expression);
    const result = calculateResult(expression, [...dice]);
    results[key] = {
      result,
      dice,
      expression,
    };
  }
  return results;
};

const startRoll = vi.fn(async (rollString) => {
  if (!rollString) throw new Error("startRoll expected a Roll String but none was provided.");
  const rollResult = { results: {} };
  extractRollTemplate(rollString);
  const rollElements = extractRollElements(rollString);
  rollResult.results = calculateRollResult(rollElements);
  rollResult.rollId = generateUUID();
  return rollResult;
});
global.startRoll = startRoll;
const finishRoll = vi.fn(() => {});
global.finishRoll = finishRoll;
//# sourceURL=sr-anarchy-2e.js
  
  const k = (function(){
  const kFuncs = {};
  
  const cascades = {"attr_character_name":{"name":"character_name","type":"text","defaultValue":"","affects":[],"triggeredFuncs":["setActionCalls"],"listenerFunc":"accessSheet","listener":"change:character_name"},"act_k-network-call":{"name":"k-network-call","type":"action","triggeredFuncs":["kReceive"],"affects":[],"addFuncs":[],"listener":"clicked:k-network-call","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_sheet_version":{"name":"sheet_version","type":"hidden","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:sheet_version","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_sr_anarchy_2e_tab":{"name":"sr_anarchy_2e_tab","type":"hidden","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:sr_anarchy_2e_tab","listenerFunc":"accessSheet","defaultValue":"nav-tabs-sr-anarchy-2e--character","calculation":"","initialFunc":"","formula":""},"act_nav-tabs-sr-anarchy-2e--character":{"name":"nav-tabs-sr-anarchy-2e--character","type":"action","triggeredFuncs":["kSwitchTab"],"affects":[],"addFuncs":[],"listener":"clicked:nav-tabs-sr-anarchy-2e--character","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"act_nav-tabs-sr-anarchy-2e--amps":{"name":"nav-tabs-sr-anarchy-2e--amps","type":"action","triggeredFuncs":["kSwitchTab"],"affects":[],"addFuncs":[],"listener":"clicked:nav-tabs-sr-anarchy-2e--amps","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"act_nav-tabs-sr-anarchy-2e--gear":{"name":"nav-tabs-sr-anarchy-2e--gear","type":"action","triggeredFuncs":["kSwitchTab"],"affects":[],"addFuncs":[],"listener":"clicked:nav-tabs-sr-anarchy-2e--gear","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_streetname":{"name":"streetname","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:streetname","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_concept":{"name":"concept","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:concept","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_strength":{"name":"strength","type":"number","triggeredFuncs":[],"affects":["light_threshold","serious_threshold","incap_threshold","athleticss_total"],"addFuncs":[],"listener":"change:strength","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_agility":{"name":"agility","type":"number","triggeredFuncs":[],"affects":["athleticsa_total","closecombata_total","pilotinga_total","rangeda_total","stealtha_total"],"addFuncs":[],"listener":"change:agility","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_logic":{"name":"logic","type":"number","triggeredFuncs":[],"affects":["conjuringl_total","crackingl_total","electronicsl_total","engineeringl_total","perceptionl_total","stealthl_total","survivall_total"],"addFuncs":[],"listener":"change:logic","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_willpower":{"name":"willpower","type":"number","triggeredFuncs":[],"affects":["light_prot","serious_prot","incap_prot","closecombatw_total","crackingw_total","sorceryw_total","survivalw_total"],"addFuncs":[],"listener":"change:willpower","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_charisma":{"name":"charisma","type":"number","triggeredFuncs":[],"affects":["conjuringc_total","influencec_total","networkc_total","survivalc_total"],"addFuncs":[],"listener":"change:charisma","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_edge":{"name":"edge","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:edge","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_armor":{"name":"armor","type":"number","triggeredFuncs":[],"affects":["light_threshold","serious_threshold","incap_threshold"],"addFuncs":[],"listener":"change:armor","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_protection":{"name":"protection","type":"number","triggeredFuncs":[],"affects":["light_prot","serious_prot","incap_prot"],"addFuncs":[],"listener":"change:protection","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_firewall":{"name":"firewall","type":"number","triggeredFuncs":[],"affects":["light_matrix","serious_matrix","incap_matrix"],"addFuncs":[],"listener":"change:firewall","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_lightnum":{"name":"lightnum","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:lightnum","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_seriousnum":{"name":"seriousnum","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:seriousnum","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_incapnum":{"name":"incapnum","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:incapnum","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_light1":{"name":"light1","type":"checkbox","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:light1","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_light2":{"name":"light2","type":"checkbox","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:light2","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_light3":{"name":"light3","type":"checkbox","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:light3","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_serious1":{"name":"serious1","type":"checkbox","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:serious1","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_serious2":{"name":"serious2","type":"checkbox","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:serious2","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_incap1":{"name":"incap1","type":"checkbox","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:incap1","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_armor_threshold":{"name":"armor_threshold","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:armor_threshold","listenerFunc":"accessSheet","defaultValue":"Armor","calculation":"","initialFunc":"","formula":""},"attr_light_threshold":{"name":"light_threshold","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:light_threshold","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":"@{strength} + @{armor}"},"attr_serious_threshold":{"name":"serious_threshold","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:serious_threshold","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":"@{strength} + @{armor} + 3"},"attr_incap_threshold":{"name":"incap_threshold","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:incap_threshold","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":"@{strength} + @{armor} + 6"},"attr_prot_threshold":{"name":"prot_threshold","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:prot_threshold","listenerFunc":"accessSheet","defaultValue":"Protection","calculation":"","initialFunc":"","formula":""},"attr_light_prot":{"name":"light_prot","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:light_prot","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":"@{willpower} + @{protection}"},"attr_serious_prot":{"name":"serious_prot","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:serious_prot","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":"@{willpower} + @{protection} + 3"},"attr_incap_prot":{"name":"incap_prot","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:incap_prot","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":"@{willpower} + @{protection} + 6"},"attr_matrix_threshold":{"name":"matrix_threshold","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:matrix_threshold","listenerFunc":"accessSheet","defaultValue":"Matrix","calculation":"","initialFunc":"","formula":""},"attr_light_matrix":{"name":"light_matrix","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:light_matrix","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":"@{firewall}"},"attr_serious_matrix":{"name":"serious_matrix","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:serious_matrix","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":"@{firewall} * 2"},"attr_incap_matrix":{"name":"incap_matrix","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:incap_matrix","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":"@{firewall} * 3"},"attr_athleticss":{"name":"athleticss","type":"number","triggeredFuncs":[],"affects":["athleticss_total"],"addFuncs":[],"listener":"change:athleticss","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_athleticss_bonus":{"name":"athleticss_bonus","type":"number","triggeredFuncs":[],"affects":["athleticss_total","athletics_total"],"addFuncs":[],"listener":"change:athleticss_bonus","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_athleticss_total":{"name":"athleticss_total","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:athleticss_total","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":"@{athleticss} + @{athleticss_bonus} + @{strength}"},"attr_athleticss_rr":{"name":"athleticss_rr","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:athleticss_rr","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_athleticsa":{"name":"athleticsa","type":"number","triggeredFuncs":[],"affects":["athleticsa_total"],"addFuncs":[],"listener":"change:athleticsa","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_athleticsa_bonus":{"name":"athleticsa_bonus","type":"number","triggeredFuncs":[],"affects":["athleticsa_total","athletics_total"],"addFuncs":[],"listener":"change:athleticsa_bonus","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_athleticsa_total":{"name":"athleticsa_total","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:athleticsa_total","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":"@{athleticsa} + @{athleticsa_bonus} + @{agility}"},"attr_athleticsa_rr":{"name":"athleticsa_rr","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:athleticsa_rr","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_closecombata":{"name":"closecombata","type":"number","triggeredFuncs":[],"affects":["closecombata_total"],"addFuncs":[],"listener":"change:closecombata","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_closecombata_bonus":{"name":"closecombata_bonus","type":"number","triggeredFuncs":[],"affects":["closecombata_total","closecombat_total"],"addFuncs":[],"listener":"change:closecombata_bonus","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_closecombata_total":{"name":"closecombata_total","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:closecombata_total","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":"@{closecombata} + @{closecombata_bonus} + @{agility}"},"attr_closecombata_rr":{"name":"closecombata_rr","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:closecombata_rr","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_closecombatw":{"name":"closecombatw","type":"number","triggeredFuncs":[],"affects":["closecombatw_total"],"addFuncs":[],"listener":"change:closecombatw","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_closecombatw_bonus":{"name":"closecombatw_bonus","type":"number","triggeredFuncs":[],"affects":["closecombatw_total","closecombat_total"],"addFuncs":[],"listener":"change:closecombatw_bonus","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_closecombatw_total":{"name":"closecombatw_total","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:closecombatw_total","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":"@{closecombatw} + @{closecombatw_bonus} + @{willpower}"},"attr_closecombatw_rr":{"name":"closecombatw_rr","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:closecombatw_rr","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_conjuringl":{"name":"conjuringl","type":"number","triggeredFuncs":[],"affects":["conjuringl_total"],"addFuncs":[],"listener":"change:conjuringl","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_conjuringl_bonus":{"name":"conjuringl_bonus","type":"number","triggeredFuncs":[],"affects":["conjuringl_total","conjuring_total"],"addFuncs":[],"listener":"change:conjuringl_bonus","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_conjuringl_total":{"name":"conjuringl_total","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:conjuringl_total","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":"@{conjuringl} + @{conjuringl_bonus} + @{logic}"},"attr_conjuringl_rr":{"name":"conjuringl_rr","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:conjuringl_rr","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_conjuringc":{"name":"conjuringc","type":"number","triggeredFuncs":[],"affects":["conjuringc_total"],"addFuncs":[],"listener":"change:conjuringc","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_conjuringc_bonus":{"name":"conjuringc_bonus","type":"number","triggeredFuncs":[],"affects":["conjuringc_total","conjuring_total"],"addFuncs":[],"listener":"change:conjuringc_bonus","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_conjuringc_total":{"name":"conjuringc_total","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:conjuringc_total","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":"@{conjuringc} + @{conjuringc_bonus} + @{charisma}"},"attr_conjuringc_rr":{"name":"conjuringc_rr","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:conjuringc_rr","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_crackingl":{"name":"crackingl","type":"number","triggeredFuncs":[],"affects":["crackingl_total"],"addFuncs":[],"listener":"change:crackingl","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_crackingl_bonus":{"name":"crackingl_bonus","type":"number","triggeredFuncs":[],"affects":["crackingl_total","cracking_total"],"addFuncs":[],"listener":"change:crackingl_bonus","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_crackingl_total":{"name":"crackingl_total","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:crackingl_total","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":"@{crackingl} + @{crackingl_bonus} + @{logic}"},"attr_crackingl_rr":{"name":"crackingl_rr","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:crackingl_rr","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_crackingw":{"name":"crackingw","type":"number","triggeredFuncs":[],"affects":["crackingw_total"],"addFuncs":[],"listener":"change:crackingw","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_crackingw_bonus":{"name":"crackingw_bonus","type":"number","triggeredFuncs":[],"affects":["crackingw_total","cracking_total"],"addFuncs":[],"listener":"change:crackingw_bonus","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_crackingw_total":{"name":"crackingw_total","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:crackingw_total","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":"@{crackingw} + @{crackingw_bonus} + @{willpower}"},"attr_crackingw_rr":{"name":"crackingw_rr","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:crackingw_rr","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_electronicsl":{"name":"electronicsl","type":"number","triggeredFuncs":[],"affects":["electronicsl_total"],"addFuncs":[],"listener":"change:electronicsl","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_electronicsl_bonus":{"name":"electronicsl_bonus","type":"number","triggeredFuncs":[],"affects":["electronicsl_total","electronics_total"],"addFuncs":[],"listener":"change:electronicsl_bonus","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_electronicsl_total":{"name":"electronicsl_total","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:electronicsl_total","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":"@{electronicsl} + @{electronicsl_bonus} + @{logic}"},"attr_electronicsl_rr":{"name":"electronicsl_rr","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:electronicsl_rr","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_engineeringl":{"name":"engineeringl","type":"number","triggeredFuncs":[],"affects":["engineeringl_total"],"addFuncs":[],"listener":"change:engineeringl","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_engineeringl_bonus":{"name":"engineeringl_bonus","type":"number","triggeredFuncs":[],"affects":["engineeringl_total","engineering_total"],"addFuncs":[],"listener":"change:engineeringl_bonus","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_engineeringl_total":{"name":"engineeringl_total","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:engineeringl_total","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":"@{engineeringl} + @{engineeringl_bonus} + @{logic}"},"attr_engineeringl_rr":{"name":"engineeringl_rr","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:engineeringl_rr","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_influencec":{"name":"influencec","type":"number","triggeredFuncs":[],"affects":["influencec_total"],"addFuncs":[],"listener":"change:influencec","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_influencec_bonus":{"name":"influencec_bonus","type":"number","triggeredFuncs":[],"affects":["influencec_total","influence_total"],"addFuncs":[],"listener":"change:influencec_bonus","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_influencec_total":{"name":"influencec_total","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:influencec_total","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":"@{influencec} + @{influencec_bonus} + @{charisma}"},"attr_influencec_rr":{"name":"influencec_rr","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:influencec_rr","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_networkc":{"name":"networkc","type":"number","triggeredFuncs":[],"affects":["networkc_total"],"addFuncs":[],"listener":"change:networkc","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_networkc_bonus":{"name":"networkc_bonus","type":"number","triggeredFuncs":[],"affects":["networkc_total","network_total"],"addFuncs":[],"listener":"change:networkc_bonus","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_networkc_total":{"name":"networkc_total","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:networkc_total","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":"@{networkc} + @{networkc_bonus} + @{charisma}"},"attr_networkc_rr":{"name":"networkc_rr","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:networkc_rr","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_perceptionl":{"name":"perceptionl","type":"number","triggeredFuncs":[],"affects":["perceptionl_total"],"addFuncs":[],"listener":"change:perceptionl","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_perceptionl_bonus":{"name":"perceptionl_bonus","type":"number","triggeredFuncs":[],"affects":["perceptionl_total","perception_total"],"addFuncs":[],"listener":"change:perceptionl_bonus","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_perceptionl_total":{"name":"perceptionl_total","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:perceptionl_total","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":"@{perceptionl} + @{perceptionl_bonus} + @{logic}"},"attr_perceptionl_rr":{"name":"perceptionl_rr","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:perceptionl_rr","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_pilotinga":{"name":"pilotinga","type":"number","triggeredFuncs":[],"affects":["pilotinga_total"],"addFuncs":[],"listener":"change:pilotinga","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_pilotinga_bonus":{"name":"pilotinga_bonus","type":"number","triggeredFuncs":[],"affects":["pilotinga_total","piloting_total"],"addFuncs":[],"listener":"change:pilotinga_bonus","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_pilotinga_total":{"name":"pilotinga_total","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:pilotinga_total","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":"@{pilotinga} + @{pilotinga_bonus} + @{agility}"},"attr_pilotinga_rr":{"name":"pilotinga_rr","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:pilotinga_rr","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_rangeda":{"name":"rangeda","type":"number","triggeredFuncs":[],"affects":["rangeda_total"],"addFuncs":[],"listener":"change:rangeda","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_rangeda_bonus":{"name":"rangeda_bonus","type":"number","triggeredFuncs":[],"affects":["rangeda_total","ranged_total"],"addFuncs":[],"listener":"change:rangeda_bonus","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_rangeda_total":{"name":"rangeda_total","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:rangeda_total","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":"@{rangeda} + @{rangeda_bonus} + @{agility}"},"attr_rangeda_rr":{"name":"rangeda_rr","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:rangeda_rr","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_sorceryw":{"name":"sorceryw","type":"number","triggeredFuncs":[],"affects":["sorceryw_total"],"addFuncs":[],"listener":"change:sorceryw","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_sorceryw_bonus":{"name":"sorceryw_bonus","type":"number","triggeredFuncs":[],"affects":["sorceryw_total","sorcery_total"],"addFuncs":[],"listener":"change:sorceryw_bonus","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_sorceryw_total":{"name":"sorceryw_total","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:sorceryw_total","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":"@{sorceryw} + @{sorceryw_bonus} + @{willpower}"},"attr_sorceryw_rr":{"name":"sorceryw_rr","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:sorceryw_rr","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_stealtha":{"name":"stealtha","type":"number","triggeredFuncs":[],"affects":["stealtha_total"],"addFuncs":[],"listener":"change:stealtha","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_stealtha_bonus":{"name":"stealtha_bonus","type":"number","triggeredFuncs":[],"affects":["stealtha_total","stealth_total"],"addFuncs":[],"listener":"change:stealtha_bonus","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_stealtha_total":{"name":"stealtha_total","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:stealtha_total","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":"@{stealtha} + @{stealtha_bonus} + @{agility}"},"attr_stealtha_rr":{"name":"stealtha_rr","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:stealtha_rr","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_stealthl":{"name":"stealthl","type":"number","triggeredFuncs":[],"affects":["stealthl_total"],"addFuncs":[],"listener":"change:stealthl","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_stealthl_bonus":{"name":"stealthl_bonus","type":"number","triggeredFuncs":[],"affects":["stealthl_total","stealth_total"],"addFuncs":[],"listener":"change:stealthl_bonus","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_stealthl_total":{"name":"stealthl_total","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:stealthl_total","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":"@{stealthl} + @{stealthl_bonus} + @{logic}"},"attr_stealthl_rr":{"name":"stealthl_rr","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:stealthl_rr","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_survivall":{"name":"survivall","type":"number","triggeredFuncs":[],"affects":["survivall_total"],"addFuncs":[],"listener":"change:survivall","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_survivall_bonus":{"name":"survivall_bonus","type":"number","triggeredFuncs":[],"affects":["survivall_total","survival_total"],"addFuncs":[],"listener":"change:survivall_bonus","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_survivall_total":{"name":"survivall_total","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:survivall_total","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":"@{survivall} + @{survivall_bonus} + @{logic}"},"attr_survivall_rr":{"name":"survivall_rr","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:survivall_rr","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_survivalc":{"name":"survivalc","type":"number","triggeredFuncs":[],"affects":["survivalc_total"],"addFuncs":[],"listener":"change:survivalc","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_survivalc_bonus":{"name":"survivalc_bonus","type":"number","triggeredFuncs":[],"affects":["survivalc_total","survival_total"],"addFuncs":[],"listener":"change:survivalc_bonus","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_survivalc_total":{"name":"survivalc_total","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:survivalc_total","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":"@{survivalc} + @{survivalc_bonus} + @{charisma}"},"attr_survivalc_rr":{"name":"survivalc_rr","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:survivalc_rr","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_survivalw":{"name":"survivalw","type":"number","triggeredFuncs":[],"affects":["survivalw_total"],"addFuncs":[],"listener":"change:survivalw","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_survivalw_bonus":{"name":"survivalw_bonus","type":"number","triggeredFuncs":[],"affects":["survivalw_total","survival_total"],"addFuncs":[],"listener":"change:survivalw_bonus","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_survivalw_total":{"name":"survivalw_total","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:survivalw_total","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":"@{survivalw} + @{survivalw_bonus} + @{willpower}"},"attr_survivalw_rr":{"name":"survivalw_rr","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:survivalw_rr","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_specializations":{"name":"specializations","type":"span","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:specializations","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_knowledge":{"name":"knowledge","type":"span","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:knowledge","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_logo":{"name":"logo","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:logo","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_keywords":{"name":"keywords","type":"span","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:keywords","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_dispositions":{"name":"dispositions","type":"span","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:dispositions","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_cues":{"name":"cues","type":"span","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:cues","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_risk_rr_0":{"name":"risk_rr_0","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:risk_rr_0","listenerFunc":"accessSheet","defaultValue":"0","calculation":"","initialFunc":"","formula":""},"attr_risk_rr_0_low":{"name":"risk_rr_0_low","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:risk_rr_0_low","listenerFunc":"accessSheet","defaultValue":"1 die","calculation":"","initialFunc":"","formula":""},"attr_risk_rr_0_normal":{"name":"risk_rr_0_normal","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:risk_rr_0_normal","listenerFunc":"accessSheet","defaultValue":"2 dice","calculation":"","initialFunc":"","formula":""},"attr_risk_rr_0_high":{"name":"risk_rr_0_high","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:risk_rr_0_high","listenerFunc":"accessSheet","defaultValue":"4 dice","calculation":"","initialFunc":"","formula":""},"attr_risk_rr_0_extreme":{"name":"risk_rr_0_extreme","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:risk_rr_0_extreme","listenerFunc":"accessSheet","defaultValue":"6+ dice","calculation":"","initialFunc":"","formula":""},"attr_risk_rr_1":{"name":"risk_rr_1","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:risk_rr_1","listenerFunc":"accessSheet","defaultValue":"1","calculation":"","initialFunc":"","formula":""},"attr_risk_rr_1_low":{"name":"risk_rr_1_low","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:risk_rr_1_low","listenerFunc":"accessSheet","defaultValue":"3 dice","calculation":"","initialFunc":"","formula":""},"attr_risk_rr_1_normal":{"name":"risk_rr_1_normal","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:risk_rr_1_normal","listenerFunc":"accessSheet","defaultValue":"5 dice","calculation":"","initialFunc":"","formula":""},"attr_risk_rr_1_high":{"name":"risk_rr_1_high","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:risk_rr_1_high","listenerFunc":"accessSheet","defaultValue":"7 dice","calculation":"","initialFunc":"","formula":""},"attr_risk_rr_1_extreme":{"name":"risk_rr_1_extreme","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:risk_rr_1_extreme","listenerFunc":"accessSheet","defaultValue":"10+ dice","calculation":"","initialFunc":"","formula":""},"attr_risk_rr_2":{"name":"risk_rr_2","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:risk_rr_2","listenerFunc":"accessSheet","defaultValue":"2","calculation":"","initialFunc":"","formula":""},"attr_risk_rr_2_low":{"name":"risk_rr_2_low","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:risk_rr_2_low","listenerFunc":"accessSheet","defaultValue":"5 dice","calculation":"","initialFunc":"","formula":""},"attr_risk_rr_2_normal":{"name":"risk_rr_2_normal","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:risk_rr_2_normal","listenerFunc":"accessSheet","defaultValue":"8 dice","calculation":"","initialFunc":"","formula":""},"attr_risk_rr_2_high":{"name":"risk_rr_2_high","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:risk_rr_2_high","listenerFunc":"accessSheet","defaultValue":"11 dice","calculation":"","initialFunc":"","formula":""},"attr_risk_rr_2_extreme":{"name":"risk_rr_2_extreme","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:risk_rr_2_extreme","listenerFunc":"accessSheet","defaultValue":"13+ dice","calculation":"","initialFunc":"","formula":""},"attr_risk_rr_3":{"name":"risk_rr_3","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:risk_rr_3","listenerFunc":"accessSheet","defaultValue":"3","calculation":"","initialFunc":"","formula":""},"attr_risk_rr_3_low":{"name":"risk_rr_3_low","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:risk_rr_3_low","listenerFunc":"accessSheet","defaultValue":"8 dice","calculation":"","initialFunc":"","formula":""},"attr_risk_rr_3_normal":{"name":"risk_rr_3_normal","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:risk_rr_3_normal","listenerFunc":"accessSheet","defaultValue":"12 dice","calculation":"","initialFunc":"","formula":""},"attr_risk_rr_3_high":{"name":"risk_rr_3_high","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:risk_rr_3_high","listenerFunc":"accessSheet","defaultValue":"15 dice","calculation":"","initialFunc":"","formula":""},"attr_risk_rr_3_extreme":{"name":"risk_rr_3_extreme","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:risk_rr_3_extreme","listenerFunc":"accessSheet","defaultValue":"N/A","calculation":"","initialFunc":"","formula":""},"act_add-shadowamps":{"name":"add-shadowamps","type":"action","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"clicked:add-shadowamps","listenerFunc":"addItem","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_repeating_shadowamps_$x_name":{"name":"repeating_shadowamps_$x_name","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_shadowamps:name","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_repeating_shadowamps_$x_type":{"name":"repeating_shadowamps_$x_type","type":"select","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_shadowamps:type","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_repeating_shadowamps_$x_cost":{"name":"repeating_shadowamps_$x_cost","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_shadowamps:cost","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_repeating_shadowamps_$x_level":{"name":"repeating_shadowamps_$x_level","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_shadowamps:level","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_repeating_shadowamps_$x_effects":{"name":"repeating_shadowamps_$x_effects","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_shadowamps:effects","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"act_add-gearamps":{"name":"add-gearamps","type":"action","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"clicked:add-gearamps","listenerFunc":"addItem","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_repeating_gearamps_$x_name":{"name":"repeating_gearamps_$x_name","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_gearamps:name","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_repeating_gearamps_$x_type":{"name":"repeating_gearamps_$x_type","type":"select","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_gearamps:type","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_repeating_gearamps_$x_cost":{"name":"repeating_gearamps_$x_cost","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_gearamps:cost","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_repeating_gearamps_$x_rating":{"name":"repeating_gearamps_$x_rating","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_gearamps:rating","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_repeating_gearamps_$x_dv":{"name":"repeating_gearamps_$x_dv","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_gearamps:dv","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_repeating_gearamps_$x_range":{"name":"repeating_gearamps_$x_range","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_gearamps:range","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_repeating_gearamps_$x_effects":{"name":"repeating_gearamps_$x_effects","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:repeating_gearamps:effects","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_template_start":{"name":"template_start","type":"hidden","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:template_start","listenerFunc":"accessSheet","defaultValue":"@{whisper}&{template:sr-anarchy-2e} {{character_name=@{character_name}}} {{character_id=@{character_id}}}","calculation":"","initialFunc":"","formula":""}};
  
  kFuncs.cascades = cascades;
  
  const repeatingSectionDetails = [{"section":"repeating_shadowamps","fields":["name","type","cost","level","effects"]},{"section":"repeating_gearamps","fields":["name","type","cost","rating","dv","range","effects"]}];
  
  kFuncs.repeatingSectionDetails = repeatingSectionDetails;
  
  const persistentTabs = ["sr_anarchy_2e_tab"];
  
  kFuncs.persistentTabs = persistentTabs;
  /**
 * The K-scaffold provides several variables to allow your scripts to tap into its information flow.
 * @namespace Sheetworkers.Variables
 */
/**
 * This stores the name of your sheet for use in the logging functions {@link log} and {@link debug}. Accessible by `k.sheetName`
 * @memberof Variables
 * @var
 * @type {string}
 */
let sheetName = 'kScaffold Powered Sheet';
kFuncs.sheetName = sheetName;
/**
	* This stores the version of your sheet for use in the logging functions{@link log} and {@link debug}. It is also stored in the sheet_version attribute on your character sheet. Accessible via `k.version`
 * @memberof Variables
	* @var
	* @type {number}
	*/
let version = 0;
kFuncs.version = version;
/**
	* A boolean flag that tells the script whether to enable or disable {@link debug} calls. If the version of the sheet is `0`, or an attribute named `debug_mode` is found on opening this is set to true for your entire session. Otherwise, it remains false.
 * @memberof Variables
	* @var
	* @type {boolean}
	*/
let debugMode = false;
kFuncs.debugMode = debugMode;
/**
	* A boolean flag that tells the script whether to output verbose logs of what is being done or not when {@link debugMode} is enabled.
 * @memberof Variables
	* @var
	* @type {boolean}
	*/
let verboseMode = false;
kFuncs.verboseMode = verboseMode;
const funcs = {};
kFuncs.funcs = funcs;
const updateHandlers = {};
const openHandlers = {};
const initialSetups = {};
const allHandlers = {};
const addFuncs = {};

const kscaffoldJSVersion = '2.7.2';
const kscaffoldPUGVersion = '2.7.0';
/**
 * Defines the rollstring that rolls made using k.startRoll begin with. Defaults to "&{template:default}".
 * @memberof Variables
 * @var
 * @type {string}
 */
let defaultRollStart = '&{template:default}';
kFuncs.defaultRollStart = defaultRollStart;/*jshint esversion: 11, laxcomma:true, eqeqeq:true*/
/*jshint -W014,-W084,-W030,-W033*/
/**
 * These are utility functions that are not directly related to Roll20 systems. They provide easy methods for everything from processing text and numbers to querying the user for input.
 * @namespace Sheetworkers.Utilities
 * @alias Utilities
 */
/**
 * Replaces problem characters to use a string as a regex
 * @memberof Utilities
 * @param {string} text - The text to replace characters in
 * @returns {string}
 * @example
 * const textForRegex = k.sanitizeForRegex('.some thing[with characters]');
 * console.log(textForRegex);// => "\.some thing\[with characters\]"
 */
const sanitizeForRegex = function(text){
  return text.replace(/\.|\||\(|\)|\[|\]|\-|\+|\?|\/|\{|\}|\^|\$|\*/g,'\\$&');
};
kFuncs.sanitizeForRegex = sanitizeForRegex;

/**
 * Converts a value to a number, it\'s default value, or `0` if no default value passed.
 * @memberof Utilities
 * @param {string|number} val - Value to convert to a number
 * @param {number} def - The default value, uses 0 if not passed
 * @returns {number|undefined}
 * @example
 * const num = k.value('100');
 * console.log(num);// => 100
 */
const value = function(val,def){
  const convertVal = +val;
  if(def !== undefined && isNaN(def)){
    throw(`K-scaffold Error: invalid default for value(). Default: ${def}`);
  }
  return convertVal === 0 ?
    convertVal :
    (+val||def||0);
};
kFuncs.value = value;

/**
 * Extracts the section (e.g. `repeating_equipment`), rowID (e.g `-;lkj098J:LKj`), and field name (e.g. `bulk`) from a repeating attribute name.
 * @memberof Utilities
 * @param {string} string - The string to parse
 * @returns {array} - Array of matches. Index 0: the section name, e.g. repeating_equipment | Index 1:the row ID | index 2: The name of the attribute
 * @returns {string[]}
 * @example
 * //Extract info from a full repeating name
 * const [section,rowID,attrName] = k.parseRepeatName('repeating_equipment_-8908asdflkjZlkj23_name');
 * console.log(section);// => "repeating_equipment"
 * console.log(rowID);// => "-8908asdflkjZlkj23"
 * console.log(attrName);// => "name"
 * 
 * //Extract info from just a row name
 * const [section,rowID,attrName] = k.parseRepeatName('repeating_equipment_-8908asdflkjZlkj23');
 * console.log(section);// => "repeating_equipment"
 * console.log(rowID);// => "-8908asdflkjZlkj23"
 * console.log(attrName);// => undefined
 */
const parseRepeatName = function(string){
  let match = string.match(/(repeating_[^_]+)_([^_]+)(?:_(.+))?/);
  match.shift();
  return match;
};
kFuncs.parseRepeatName = parseRepeatName;

/**
 * Parses out the components of a trigger name similar to [parseRepeatName](#parserepeatname). Aliases: parseClickTrigger.
 * 
 * Aliases: `k.parseClickTrigger`
 * @memberof Utilities
 * @param {string} string The triggerName property of the
 * @returns {array} - For a repeating button named `repeating_equipment_-LKJhpoi98;lj_roll`, the array will be `['repeating_equipment','-LKJhpoi98;lj','roll']`. For a non repeating button named `roll`, the array will be `[undefined,undefined,'roll']`
 * @returns {string[]}
 * @example
 * //Parse a non repeating trigger
 * const [section,rowID,attrName] = k.parseTriggerName('clicked:some-button');
 * console.log(section);// => undefined
 * console.log(rowID);// => undefined
 * console.log(attrName);// => "some-button"
 * 
 * //Parse a repeating trigger
 * const [section,rowID,attrName] = k.parseTriggerName('clicked:repeating_attack_-234lkjpd8fu8usadf_some-button');
 * console.log(section);// => "repeating_attack"
 * console.log(rowID);// => "-234lkjpd8fu8usadf"
 * console.log(attrName);// => "some-button"
 * 
 * //Parse a repeating name
 * const [section,rowID,attrName] = k.parseTriggerName('repeating_attack_-234lkjpd8fu8usadf_some-button');
 * console.log(section);// => "repeating_attack"
 * console.log(rowID);// => "-234lkjpd8fu8usadf"
 * console.log(attrName);// => "some-button"
 */
const parseTriggerName = function(string){
  let match = string.replace(/^clicked:/,'').match(/(?:(repeating_[^_]+)_([^_]+)_)?(.+)/);
  match.shift();
  return match;
};
kFuncs.parseTriggerName = parseTriggerName;
const parseClickTrigger = parseTriggerName;
kFuncs.parseClickTrigger = parseClickTrigger;

/**
 * Parses out the attribute name from the htmlattribute name.
 * @memberof Utilities
 * @param {string} string - The triggerName property of the [event](https://wiki.roll20.net/Sheet_Worker_Scripts#eventInfo_Object).
 * @returns {string}
 * @example
 * //Parse a name
 * const attrName = k.parseHtmlName('attr_attribute_1');
 * console.log(attrName);// => "attribute_1"
 */
const parseHTMLName = function(string){
  let match = string.match(/(?:attr|act|roll)_(.+)/);
  match.shift();
  return match[0];
};
kFuncs.parseHTMLName = parseHTMLName;

/**
 * Capitalize each word in a string
 * @memberof Utilities
 * @param {string} string - The string to capitalize
 * @returns {string}
 * @example
 * const capitalized = k.capitalize('a word');
 * console.log(capitalized);// => "A Word"
 */
const capitalize = function(string){
  return string.replace(/(?:^|\s+|\/)[a-z]/ig,(letter)=>letter.toUpperCase());
};
kFuncs.capitalize = capitalize;

/**
 * Extracts a roll query result for use in later functions. Must be awaited as per [startRoll documentation](https://wiki.roll20.net/Sheet_Worker_Scripts#Roll_Parsing.28NEW.29). Stolen from [Oosh\'s Adventures with Startroll thread](https://app.roll20.net/forum/post/10346883/adventures-with-startroll).
 * @memberof Utilities
 * @param {string} query - The query should be just the text as the `?{` and `}` at the start/end of the query are added by the function.
 * @returns {Promise} - Resolves to the selected value from the roll query
 * @example
 * const rollFunction = async function(){
 *  //Get the result of a choose from list query
 *  const queryResult = await extractQueryResult('Prompt Text Here|Option 1|Option 2');
 *  console.log(queryResult);//=> "Option 1" or "Option 2" depending on what the user selects
 * 
 *  //Get free form input from the user
 *  const freeResult = await extractQueryResult('Prompt Text Here');
 *  consoel.log(freeResult);// => Whatever the user entered
 * }
 */
const extractQueryResult = async function(query){
  const rollObj = {
    query:`[[0[response=?{${query}}]]]`
  };
	let {roll} = await _startRoll(rollObj,'!');
  roll.finish();
	return roll.results.query.expression.replace(/^.+?response=|\]$/g,'');
};
kFuncs.extractQueryResult = extractQueryResult;

/**
 * Simulates a query for ensuring that async/await works correctly in the sheetworker environment when doing conditional startRolls. E.g. if you have an if/else and only one of the conditions results in `startRoll` being called (and thus an `await`), the sheetworker environment would normally crash. Awaiting this in the condition that does not actually need to call `startRoll` will keep the environment in sync.
 * @memberof Utilities
 * @param {string|number} [value] - The value to return. Optional.
 * @returns {Promise} - Resolves to the value passed to the function
 * @example
 * const rollFunction = async function(){
 *  //Get the result of a choose from list query
 *  const queryResult = await pseudoQuery('a value');
 *  console.log(queryResult);//=> "a value"
 * }
 */
const pseudoQuery = async function(value){  
  const rollObj = {
    query:`[[0[response=${value}]]]`
  };
	let {roll} = await _startRoll(rollObj,'!');
  roll.finish();
	return roll.results.query.expression.replace(/^.+?response=|\]$/g,'');
};
kFuncs.pseudoQuery = pseudoQuery;

/**
 * An alias for console.log.
 * @memberof Utilities
 * @param {any} msg - The message can be a straight string, an object, or an array. If it is an object or array, the object will be broken down so that each key is used as a label to output followed by the value of that key. If the value of the key is an object or array, it will be output via `console.table`.
 */
const log = function(msg){
  if(typeof msg === 'string'){
    console.log(`%c${kFuncs.sheetName} log| ${msg}`,"background-color:#159ccf");
  }else if(typeof msg === 'object'){
    Object.keys(msg).forEach((m)=>{
      if(typeof msg[m] === 'string'){
        console.log(`%c${kFuncs.sheetName} log| ${m}: ${msg[m]}`,"background-color:#159ccf");
      }else{
        console.log(`%c${kFuncs.sheetName} log| ${typeof msg[m]} ${m}`,"background-color:#159ccf");
        console.table(msg[m]);
      }
    });
  }
};
kFuncs.log = log;

/**
 * Alias for console.log that only triggers when debug mode is enabled or when the sheet\'s version is `0`. Useful for entering test logs that will not pollute the console on the live sheet.
 * @memberof Utilities
 * @param {any} msg - 'See {@link k.log}
 * @param {boolean} force - Pass as a truthy value to force the debug output to be output to the console regardless of debug mode.
 * @returns {void}
 */
const debug = function(msg,force){
  if(!kFuncs.debugMode && !force && kFuncs.version > 0) return;
  if(typeof msg === 'string'){
    console.warn(`%c${kFuncs.sheetName} DEBUG| ${msg}`,"background-color:tan;color:red;");
  }else if(typeof msg === 'object'){
    Object.keys(msg).forEach((m)=>{
      if(typeof msg[m] === 'string'){
        console.warn(`%c${kFuncs.sheetName} DEBUG| ${m}: ${msg[m]}`,"background-color:tan;color:red;");
      }else{
        console.warn(`%c${kFuncs.sheetName} DEBUG| ${typeof msg[m]} ${m}`,"background-color:tan;color:red;font-weight:bold;");
        console.table(msg[m]);
      }
    });
  }
};
kFuncs.debug = debug;

/**
 * Orders the section id arrays for all sections in the `sections` object to match the repOrder attribute.
 * @memberof Utilities
 * @param {attributesProxy} attributes - The attributes object that must have a value for the reporder for each section.
 * @param {object[]} sections - Object containing the IDs for the repeating sections, indexed by repeating section name.
 */
const orderSections = function(attributes,sections,casc){
  Object.keys(sections).forEach((section)=>{
    attributes.attributes[`_reporder_${section}`] = commaArray(attributes[`_reporder_${section}`]);
    sections[section] = orderSection(attributes.attributes[`_reporder_${section}`],sections[section],attributes,section,casc);
  });
};
kFuncs.orderSections = orderSections;

/**
 * Orders a single ID array.
 * @memberof Utilities
 * @param {string[]} repOrder - Array of IDs in the order they are in on the sheet.
 * @param {string[]} IDs - Array of IDs to be ordered. Aka the default ID Array passed to the getSectionIDs callback
 * @param {AttributesProxy} [attributes] - The Kscaffold attributes object
 * @param {string} [section] - the name of the section being ordered. If section and attributes are passed, will return an ordered array that does not include IDs for rows that do not exist.
 * @param {object} [casc] - the object describing the default state of the sheet.
 * @returns {string[]} - The ordered id array
 */
const orderSection = function(repOrder,IDs=[], attributes, section,casc){
  const idArr = [...repOrder.filter(v => v),...IDs.filter(id => !repOrder.includes(id.toLowerCase()))]
    .filter(id => {
      const testAttr = Object.keys(casc).find(a => a.toLowerCase().startsWith(`attr_${section}_${id}`));
      const testName = testAttr?.replace(/attr_/,'');
      const idName = testName?.replace(/\$x/,id);
      return (!section && !casc) ||
        (
          idName && 
          (
            attributes.attributes.hasOwnProperty(idName) ||
            attributes.updates.hasOwnProperty(idName)
          )
        );
    });
  return idArr;
};
kFuncs.orderSection = orderSection;

/**
 * Splits a comma delimited string into an array
 * @memberof Utilities
 * @param {string} string - The string to split.
 * @returns {array} - The string segments of the comma delimited list.
 */
const commaArray = function(string=''){
  return string.toLowerCase().split(/\s*,\s*/);
};
kFuncs.commaArray = commaArray;

// Roll escape functions for passing data in action button calls. Base64 encodes/decodes the data.
const RE = {
  chars: {
      '"': '%quot;',
      ',': '%comma;',
      ':': '%colon;',
      '}': '%rcub;',
      '{': '%lcub;',
  },
  escape(data) {
    return typeof data === 'object' ?
      `KDATA${btoa(JSON.stringify(data))}` :
      `KSTRING${btoa(data)}`;
  },
  unescape(string) {
    const isData = typeof string === 'string' &&
      (
        string.startsWith('KDATA') ||
        string.startsWith('KSTRING')
      );
    return isData ?
      (
        string.startsWith('KDATA') ?
          JSON.parse(atob(string.replace(/^KDATA/,''))) :
          atob(string.replace(/^KSTRING/,''))
      ) :
      string;
  }
};


/**
 * Encodes data in Base64. This is useful for passing roll information to action buttons called from roll buttons.
 * @function
 * @param {string|object|any[]} data - The data that you want to Base64 encode
 * @returns {string} - The encoded data
 * @memberof! Utilities
 */
const escape = RE.escape;
/**
 * Decodes Base64 encoded strings that were created by the K-scaffold
 * @function
 * @param {string|object|any[]} string - The string of encoded data to decode. If this is not a string, or is not a string that was encoded by the K-scaffold, it will be returned as is.
 * @returns {string|object|any[]}
 * @memberof! Utilities
 */
const unescape = RE.unescape;

Object.assign(kFuncs,{escape,unescape});

/**
 * Parses a macro so that it is reduced to the final values of all attributes contained in the macro. Will drill down up to 99 levels deep. If the string was not parseable, string will be returned with as much parsed as possible.
 * @memberof Utilities
 * @param {string} mutStr - The string macro to parse
 * @param {AttributesProxy} attributes - The K-scaffold Attributes Proxy
 * @param {Object} sections - The K-scaffold sections object
 * @returns {string} - The string with all attributes replaced by their values (if possible).
 */
const parseMacro = (str,attributes,sections) => {
  let iter = 0;
  let mutStr = str;
  while(mutStr.match(/@{.+?}/) && iter < 99){
    mutStr = mutStr.replace(/@{(.+?)}/g,(match,name) => {
      name = name.replace(/\|/,'_');
      return attributes[name] !== null && attributes[name] !== undefined ?
        attributes[name] :
        `@(${name})`;
    })
    iter++;
  }
  mutStr = mutStr.replace(/@\((.+?)\)/g,'@{$1}');
  return mutStr;
}
kFuncs.parseMacro = parseMacro;

/**
 * Sends data to another character sheet to cause a change on that sheet. WARNING, this function should not be used in response to an attribute change to avoid spamming the chat with api messages.
 * 
 * ![k.send.gif](/k-scaffold/k.send.gif)
 * @memberof Utilities
 * @param {string} characterName - The character to connect to
 * @param {string} funcName - Name of the function to call similar to function name used in {@link callFunc}.
 * @param  {...any} args - The arguments to pass to the function call no the other sheet. These are passed after the normal destructure object for a K-scaffold function call.
 * @example
 * //Function that is called by the source sheet
 * const dispatchPartner = async function({trigger,attributes,sections,casc}){
 *  const partnerName = await (
 *    attributes.partner_name ?
 *      k.pseudoQuery(attributes.partner_name) :
 *      k.extractQueryResult('Partner name')
 *  );
 *  attributes.partner_name = partnerName;
 *  //passing the attributes of the source sheet
 *  k.send(partnerName,'receivePartner',attributes);
 *  attributes.set();
 * };
 * k.registerFuncs({dispatchPartner});
 * 
 * //Function called on target sheet. Partner is the attributes from the source sheet
 * const receivePartner  = function({trigger,attributes,sections,casc},partner){
 *   attributes.from_partner = partner.for_partner;
 *   attributes.partner_name = partner.character_name;
 * };
 * k.registerFuncs({receivePartner });
 */
const send = async function(characterName,funcName,...args){
  const data = RE.escape({
    funcName,
    args
  });
  const roll = await startRoll(`!@{${characterName}|character_name}%{${characterName}|k-network-call||${data}}&{noerror}`);
  finishRoll(roll.rollId);
};
kFuncs.send = send;

const kReceive = function({trigger,attributes,sections,casc}) {
  const data = trigger.rollData;
  callFunc(data.funcName,{attributes,sections,casc},...data.args);
};
funcs.kReceive = kReceive;/*jshint esversion: 11, laxcomma:true, eqeqeq:true*/
/*jshint -W014,-W084,-W030,-W033*/
/**
 * Detailed descriptions of the arguments that are passed to functions registered with the K-scaffold.
 * @namespace Sheetworkers.Function Arguments
 */
/**
 * An object that stores the rowID information for each repeating section on the sheet.
 * @name sections
 * @memberof Function Arguments
 * @var
 * @property {string[]} repeating_section_name - The row IDs of a given repeating section. The repeating section name is used **with** the `repeating_` prefix (e.g. `sections['repeating_weapons']`).
 */
/**
 * Object that stores the default trigger information for all attributes. Indexed by attribute, button name, or fieldset name prefixed with `attr_`, `act_`, or `fieldset_` respectively.
 * @name casc
 * @memberof Function Arguments
 * @var
 */
/**
 * Object describing the attribute that is currently being worked on. In addition to the properties described here, the properties from the Roll20 event will also be present if the attribute was the original event. Additional properties may be present if you specified them when creating the input for the attribute.
 * @name trigger
 * @memberof Function Arguments
 * @var
 * @property {string} name - The full name of the attribute.
 * @property {string[]} triggeredFuncs - Array of function names that will be called when this attribute is worked on.
 * @property {string} calculation - The name of the function that is used to calculate the value of this attribute.
 * @property {string} formula - The macro syntax formula to use to calculate this attributes value.
 * @property {string[]} affects - Array of attribute names that this attribute might affect.
 * @property {string[]} addFuncs - Functions that are called when the add row button is clicked for a customControlFieldset.
 * @property {string} listener - What function was used to listen for changes to this attribute. Unless you have decided to implement your own event handling, this should always be `"accessSheet"`.
 * @property {string} type - What type of thing this trigger is for (e.g. number, action).
 */
//# Attribute Obj Proxy handler
/**
	* A representation of the sheet's attributes. This is a proxy for the actual object and will keep track of original values and updates that have been applied. Calling an attribute directly on the attributes value will return it's current value coerced into a number if it is numeric. Setting a property on the attributes object will add it the list of updates which will be applied the next time the `set()` method is called on attributes.
  * @name attributes
  * @memberof Function Arguments
  * @var
  * @property {object} attributes - The raw original data of the character sheet.
  * @property {object} updates - The raw data that will be saved to the character sheet once all operations have been completed.
  * @property {function} set - Method to apply changes to the character sheet. This is called automatically at the end of the scaffold's event handling. Needs to be called manually if inside an asynchronous function, such as when using the startRoll sheetworker (or any of the scaffold aliases for startRoll). The method uses object destructuring syntax for the arguments it takes.
  * @property {boolean} [set.vocal=false] - Whether the set is done silently or not. Should almost always be left at false. `attributes.set({vocal:true})`
  * @property {function} [set.callback] - Callback function to be invoked once the setAttrs is complete. `attributes.set({callback(){/*do a thing}})`
  * @property {any} attribute_name - Name of any attribute whose data from the character sheet you want to access. Will only return a value if the attribute was defined using the scaffold's pug mixins (e.g. +input). If the value of the attribute is numerical (e.g. `"5"`), it will be returned as a number. You can also apply changes by simply assigning a value to an attribute name (e.g. `attributes.character_name = 'New Character'`).
  * @property {object} repOrders - Object showing the ordered arrays for the _reporder_ attributes for each repeating section. Indexed by repeating section name
  * @property {object[]} repeating_section_name - Name of a repeating section whose data you want to access (e.g. `attributes.repeating_weapons`). The data will be returned as an array with objects describing each row in the order they are on the sheet. Objects are indexed by rowID as well. Mutating array methods are replaced by the `sort` and `move` methods. Non mutating array methods can be used as normal.
  * @property {string} repeating_section_name._section - the name of the repeating section. Used internally by the scaffold. Readonly.
  * @property {function} move - Method for reordering rows.
  * @property {number|string} move.startingPosition - the row id or position index for the row you want to move.
  * @property {number} move.destination - The position in the section where you want the row to be moved to. If the position is greater than the length of the section, the row will be moved to the last position. If the position is negative, it will be moved to the start of the section.
  * @property {boolean} [move.silent=false] - Whether the reordering should trigger setSectionOrder or not.
  * @property {function} sort - Alias for the default Array.sort method. Functions as the default sort method, but has an optional second argument.
  * @property {function} sort.callback - The function to use for determining the sort order. See the [Array.sort documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) for details.
  * @property {boolean} [sort.silent=false] - Whether to apply the sort to the display of the repeating section.
  * @property {function} create - Method for creating a new row in a repeating section. Arguments for this method can be in any order. A row will not actually be created unless data is assigned to at least one attribute of the row, either at creation or later. Returns the object representing the new row.
  * @property {string} [create.custom] - Custom text that replaces the starting characters of the rowID
  * @property {object} [create.data] - what to set the attribute values of the row to. If not provided, the row object will be created, but no row will be created on the sheet until data is specified.
  * @property {object} repeating_section_name.rowID_or_Index - Returns the object describing a row in a repeating section specified by row ID or indexed position. (e.g. `attributes.repeating_weapons[0]` returns the data for the first row in the weapons section)
  * * @property {object} repeating_section_name.rowID_or_Index._id - The id of the row. Readonly.
  * * @property {object} repeating_section_name.rowID_or_Index._section - The repeating section the row belongs to. Readonly.
  * @property {any} repeating_section_name.rowID_or_Index.attribute_name - functions as an attribute_name call on the base attributes object. (e.g. `attributes['repeating_weapons_-jJ2soils_name']` is equivalent to `attributes.repeating_weapons['-jJ2soils'].name`).
  * @type {object}
	*/
  const createAttrProxy = function(attrs,sections,casc){
    //creates a proxy for the attributes object so that values can be worked with more easily.
    const getCascObj = function(event){
      const eventName = event.triggerName || event.sourceAttribute;
      let typePrefix = eventName.startsWith('clicked:') ?
        'act_' :
        event.removedInfo ?
        'fieldset_' :
        'attr_';
      let cascName = `${typePrefix}${eventName.replace(/(?:removed?|clicked):/,'')}`;
      let cascObj = casc[cascName];
      if(kFuncs.verboseMode){
        debug({[cascName]:cascObj});
      }
      if(event && cascObj){
        Object.assign(cascObj,event);
        if(event.originalRollId){
          cascObj.rollData = RE.unescape(event.originalRollId);
        }
      }
      return cascObj || {};
    };
    
    const triggerFunctions = function(obj){
      if(obj.triggeredFuncs && obj.triggeredFuncs.length){
        if(kFuncs.verboseMode){
          debug(`triggering functions for ${obj.name}`);
        }
        obj.triggeredFuncs && obj.triggeredFuncs.forEach(func=>funcs[func] ? 
          funcs[func]({trigger:obj,attributes,sections,casc}) :
          debug(`!!!Warning!!! no function named ${func} found. Triggered function not called for ${obj.name}`,true));
      }
    };
    
    const initialFunction = function(obj){
      if(obj.initialFunc){
        if(kFuncs.verboseMode){
          debug(`initial functions for ${obj.name}`);
        }
        funcs[obj.initialFunc] ?
          funcs[obj.initialFunc]({trigger:obj,attributes,sections}) :
          debug(`!!!Warning!!! no function named ${obj.initialFunc} found. Initial function not called for ${obj.name}`,true);
      }
    };
    const alwaysFunctions = function(trigger){
      Object.values(allHandlers).forEach((handler)=>{
        handler({trigger,attributes,sections,casc});
      });
    };
    const processChange = function({event,trigger}){
      if(event && !trigger){
        debug(`${event.sourceAttribute} change detected. No trigger found`);
        return;
      }
      if(!attributes || !sections || !casc){
        debug(`!!! Insufficient arguments || attributes > ${!!attributes} | sections > ${!!sections} | casc > ${!!casc} !!!`);
        return;
      }
      if(kFuncs.verboseMode){
        debug({trigger});
      }
      if(event){
        if(Array.isArray(trigger.affects)){
          attributes.queue.push(...trigger.affects);
        }
        alwaysFunctions(trigger,attributes,sections,casc);//Functions that should be run for all events.
        initialFunction(trigger,attributes,sections,casc);//functions that should only be run if the attribute was the thing changed by the user
  
      }
      if(trigger){
        triggerFunctions(trigger,attributes,sections,casc);
        if(!event){
          // Handle autocalc formula
          if(trigger.formula){
            attributes[trigger.name] = parseKFormula({trigger,attributes,sections,casc});
          }
          // handle calculation of element
          if(
            trigger.calculation &&
            funcs[trigger.calculation]
          ){
            attributes[trigger.name] = funcs[trigger.calculation]({trigger,attributes,sections,casc});
          }else if(trigger.calculation && !funcs[trigger.calculation]){
            debug(`K-Scaffold Error: No function named ${trigger.calculation} found`);
          }
        }
      }
      attributes.set();
    };
    const attrTarget = {
      updates:{},
      attributes:{...attrs},
      repOrders:{},
      queue: [],
      casc:{},
      alwaysFunctions,
      processChange,
      triggerFunctions,
      initialFunction,
      getCascObj
    };
    const repeatObjects = {};
    const repeatTargetObjects = {};
    const repeatHandler = {
      get:function(obj,prop){
        const row = `${obj._section}_${obj._id}`;
        if(prop === '_isProxy'){
          return true;
        }
        if(prop === 'toJSON'){
          return () => {
            return Object.keys(obj).reduce((o,k) => {
              o[k] = attributes[`${row}_${k}`];
              return o;
            },{_id: obj._id,_section: obj._section});
          }
        }
        if(prop === 'remove'){
          return function(){
            delete attributes[obj._section][obj._id];
          }
        }
        return obj[prop];
      },
      set: function(obj,prop,value){
        if(prop === '_id' || prop === '_section'){
          throw new Error(`!!!Warning: cannot change the id or section of a repeating object!!!`);
        }else if( prop === '_index'){
          throw new Error(`!!!Warning: Cannot reorder sections by setting the _index. Sort the repeating array or use k.setSectionOrder!!!`);
        }
        const fullRef = `${obj._section}_${obj._id}_${prop}`;
        attributes[fullRef] = value;
        obj[prop] = value;
      }
    };
    const repeatArrHandler = {
      get(arr,prop){
        prop = typeof prop === 'string' ?
          prop.replace(/^\$/,'') :
          prop;
        if(prop === '_isProxy'){
          return true;
        }
        if(
          prop === 'fill' ||
          prop === 'shift' ||
          prop === 'pop' ||
          prop === 'unshift' ||
          prop === 'splice'
        ){
          throw new Error(`The ${prop} method is not allowed on section arrays`);
        }
        if(prop === 'create'){
          return function(){
            const argArray = [...arguments];
            const custom = argArray.find(e => typeof e === 'string');
            const data = argArray.find(e => typeof e === 'object' && !Array.isArray(e));
  
            const row = _generateRowID(arr._section,sections,custom);
            const id = row.replace(/repeating_[^_]+_/,'');
            arr[id] = createRepeatObj(arr._section,id);
            arr.push(arr[id]);
            if(data){
              Object.entries(data).forEach(([key,value]) => {
                if(arr[id].hasOwnProperty(key)){
                  arr[id][key] = value;
                }else{
                  debug(`!!!Warning: no input exists in ${obj._section} for the attribute "${key}"!!!`);
                }
              });
            }
            return arr[id];
          }
        }
        if(prop === 'move'){
          return function(){
            const ref = arguments[0];
            const targ = arguments[1];
            const vocal = !arguments[2]
            // TODO: add protection for missing arguments
            let id;
            let index;
            if(sections[arr._section].includes(ref)){
              id = ref;
              index = sections[arr._section].indexOf(id);
            }else if(!Number.isNaN(ref)){
              index = ref;
              id = sections[arr._section][index];
            }
            if(
              !Number.isNaN(index) &&
              id &&
              !Number.isNaN(targ)
            ){
              const obj = arr.splice(index,1);
              arr.splice(targ,0,obj);
              sections[arr._section].splice(index,1);
              sections[arr._section].splice(targ,0,id);
              if(vocal){
                attributes.set({
                  callback(){
                    _setSectionOrder(arr._section,sections[arr._section]);
                  }
                });
              }
            }
          }
        }
        if(prop === 'sort'){
          return function(){
            const callback = arguments[0];
            const vocal = !arguments[1];
            sections[arr._section].sort((a,b) => {
              const aObj = arr[a];
              const bObj = arr[b];
              const sortResult = callback(aObj,bObj);
              return sortResult;
            });
            arr.sort((a,b) => {
              const aIndex = sections[arr._section].indexOf(a._id);
              const bIndex = sections[arr._section].indexOf(b._id);
              return aIndex - bIndex;
            });
            // Defer setSectionOrder into a set() callback so it fires AFTER pending setAttrs
            // (the sort may coexist with attribute writes that create the rows being reordered).
            if(vocal){
              attributes.set({
                callback(){
                  _setSectionOrder(arr._section,sections[arr._section]);
                }
              });
            }
            return arr;
          }
        }
        if(arr[prop] || Number.isNaN(prop)){
          return Reflect.get(...arguments);
        }
        if(sections[arr._section].includes(prop)){
          arr[prop] = createRepeatObj(arr._section,prop);
          arr.push(arr[prop]);
          return arr[prop];
        }
      },
      set(obj,prop,value){
        if(prop === 'section'){
          throw new Error('!!!Warning: Section property of a repeating section is readonly!!!')
        }
      },
      deleteProperty(arr,prop){
        if(
          !prop.startsWith('_') &&
          arr[prop] &&
          arr[prop]._isProxy
        ){
          let id;
          let index;
          if(typeof prop === 'string' && prop.startsWith('-')){
            id = prop;
            index = sections[arr._section].indexOf(id);
          }else{
            index = prop;
            id = arr[index]._id;
          }
          delete arr[id];
          arr.splice(index,1);
          sections[arr._section].splice(index,1);
          const row = `${arr._section}_${id}`;
          removeRepeatingRow(row);
        }
      }
    };
    const createRepeatObj = (prop,id) => {
      const row = `${prop}_${id}`;
      const fields = repeatingSectionDetails.find(o => o.section === prop).fields;
      const retObj = fields.reduce((o,field) => {
        o[field] = attributes[`${row}_${field}`];
        return o;
      },{_id:id,_section: prop})
      repeatTargetObjects[prop] = repeatTargetObjects[prop] || {};
      repeatTargetObjects[prop][id] = retObj;
      return new Proxy(retObj,repeatHandler);
    }
    const attrHandler = {
      get:function(obj,prop){//gets the most value of the attribute.
        if(prop === '_isProxy'){
          return true;
        }
        if(prop === 'toJSON'){
          return () => ({...obj.attributes,...obj.updates});
        }else if(prop === 'set'){
          return function(){
            let {callback,vocal} = arguments[0] ? arguments[0] : {};
            // Preserve the caller's callback across cascade-queue processing. Without this,
            // the recursive set() triggered by cascade processing (which passes no callback)
            // would drop the original caller's callback silently.
            if(callback){
              obj._pendingCallback = callback;
            }
            if(sections && casc && attributes.queue.length){
              const triggerName = attributes.queue.shift();
              const trigger = getCascObj({sourceAttribute:triggerName});
              processChange({trigger,attributes,sections,casc});
            }else{
              const resolvedCallback = callback || obj._pendingCallback;
              obj._pendingCallback = undefined;
              if(kFuncs.verboseMode){
                debug({updates:obj.updates});
              }
              const trueCallback = Object.keys(obj.repOrders).length ?
                function(){
                  Object.entries(obj.repOrders).forEach(([section,order])=>{
                    _setSectionOrder(section,order)
                  });
                  resolvedCallback && resolvedCallback();
                }:
                resolvedCallback;
              Object.keys(obj.updates).forEach((key)=>obj.attributes[key] = obj.updates[key]);
              const update = obj.updates;
              obj.updates = {};
              set(update,vocal,trueCallback);
            }
          }
        }else if(/^repeating_[^_]+$/.test(prop)){
          // if it's been lazy loaded, use it
          if(!repeatObjects[prop]){
            // otherwise lazy load it
            const baseArr = [];
            baseArr._section = prop;
            repeatObjects[prop] = new Proxy(sections[prop].reduce((arr,id,i) => {
              const rowObj = createRepeatObj(prop,id,i);
              arr.push(rowObj);
              arr[id] = rowObj;
              return arr;
            },baseArr),repeatArrHandler);
          }
          return repeatObjects[prop];
        }else if(Object.keys(obj).some(key=>key===prop)){ 
          return Reflect.get(...arguments)
        }else{
          let retValue;
          switch(true){
            case obj.repOrders.hasOwnProperty(prop):
              retValue = obj.repOrders[prop];
              break;
            case obj.updates.hasOwnProperty(prop):
              retValue = obj.updates[prop];
              break;
            default:
              retValue = obj.attributes[prop];
              break;
          }
          let cascRef = `attr_${prop.replace(/(repeating_[^_]+_)[^_]+/,'$1\$X')}`.toLowerCase();
          let numRetVal = +retValue;
          if(!Number.isNaN(numRetVal) && retValue !== ''){
            retValue = numRetVal;
          }else if(cascades[cascRef] && cascades[cascRef].type === 'number'){
            // Only substitute the default when the input is explicitly typed as a number.
            // Previously the proxy also substituted when defaultValue was numeric, which caused
            // non-numeric checkbox values (e.g. '/w gm') to be clobbered by the numeric default (0).
            retValue = cascades[cascRef].defaultValue;
          }
          return retValue;
        }
      },
      set:function(obj,prop,value){
        //Sets the value. Also verifies that the value is a valid attribute value
        //e.g. not undefined, null, or NaN
        if(value || value===0 || value===''){
          if(/reporder/.test(prop)){
            let section = prop.replace(/_reporder_/,'');
            obj.repOrders[section] = value;
          }else if(`${obj.attributes[prop]}` !== `${value}` ||
            (obj.updates.hasOwnProperty(prop) && `${obj.updates[prop]}` !== `${value}`)
          ){
            if(sections && casc){
              let trigger = getCascObj({sourceAttribute:prop});
              if(!trigger.name){
                Object.assign(casc,expandCascade(cascades,sections));
                trigger = getCascObj({sourceAttribute:prop});
              }
              if(Array.isArray(trigger.affects)){
                attributes.queue.push(...trigger.affects);
              }
            }
            const repRx = /^(repeating_[^_]+)_([^_]+)_(.+)$/;
            if(repRx.test(prop)){
              const [,section,rowID,field] = prop.match(repRx);
              if(repeatObjects[section]){
                repeatObjects[section][rowID] = repeatObjects[section][rowID] || createRepeatObj(section,rowID);
                repeatTargetObjects[section][rowID][field] = value;
              }
            }
            obj.updates[prop] = value;
          }
        }else{
          debug(`!!!Warning: Attempted to set ${prop} to an invalid value:${value}; value not stored!!!`);
        }
        return true;
      },
      deleteProperty(obj,prop){
        //removes the property from the original attributes, updates, and the reporders
        Object.keys(obj).forEach((key)=>{
          delete obj[key][prop.toLowerCase()];
        });
      }
    };
    const attributes = new Proxy(attrTarget,attrHandler);
    return attributes;
  };
  
  /**
   * Function that registers a function for being called via the funcs object. Returns true if the function was successfully registered, and false if it could not be registered for any reason.
   * @memberof Utilities
   * @param {object} funcObj - Object with keys that are names to register functions under and values that are functions.
   * @param {object} optionsObj - Object that contains options to use for this registration.
   * @param {string[]} optionsObj.type - Array that contains the types of specialized functions that apply to the functions being registered. Valid types are `"opener"`, `"updater"`, and `"default"`. `"default"` is always used, and never needs to be passed.
   * @returns {boolean} - True if the registration succeeded, false if it failed.
   * @example
   * //Basic Registration
   * const myFunc = function({trigger,attributes,sections,casc}){};
   * k.registerFuncs({myFunc});
   * 
   * //Register a function to run on sheet open
   * const openFunc = function({trigger,attributes,sections,casc}){};
   * k.registerFuncs({openFunc},{type:['opener']})
   * 
   * //Register a function to run on all events
   * const allFunc = function({trigger,attributes,sections,casc}){};
   * k.registerFuncs({allFunc},{type:['all']})
   */
  const registerFuncs = function(funcObj,optionsObj = {}){
    if(typeof funcObj !== 'object' || typeof optionsObj !== 'object'){
      debug(`!!!! K-scaffold error: Improper arguments to register functions !!!!`);
      return false;
    }
    const typeArr = optionsObj.type ? ['default',...optionsObj.type] : ['default'];
    const typeSwitch = {
      'opener':openHandlers,
      'updater':updateHandlers,
      'new':initialSetups,
      'all':allHandlers,
      'default':funcs
    };
    let setState;
    Object.entries(funcObj).map(([prop,value])=>{
      typeArr.forEach((type)=>{
        if(typeSwitch[type][prop]){
          debug(`!!! Duplicate function name for ${prop} as ${type}!!!`);
          setState = false;
        }else if(typeof value === 'function'){
          typeSwitch[type][prop] = value;
          setState = setState !== false ? true : false;
        }else{
          debug(`!!! K-scaffold error: Function registration requires a function. Invalid value to register as ${type} !!!`);
          setState = false;
        }
      });
    });
    return setState;
  };
  kFuncs.registerFuncs = registerFuncs;
  
  /**
   * Function that sets up the action calls used in the roller mixin.
   * @memberof Sheetworkers
   * @param {object} attributes - The attribute values of the character
   * @param {object[]} sections - All the repeating section IDs
   */
  const setActionCalls = function({attributes,sections}){
    actionAttributes.forEach((base)=>{
      let [section,,field] = k.parseTriggerName(base);
      let fieldAction = field.replace(/_/g,'-');
      if(section){
        sections[section].forEach((id)=>{
          attributes[`${section}_${id}_${field}`] = `%{${attributes.character_name}|${section}_${id}_${fieldAction}}`;
        });
      }else{
        attributes[`${field}`] = `%{${attributes.character_name}|${fieldAction}}`;
      }
    });
  };
  funcs.setActionCalls = setActionCalls;
  kFuncs.setActionCalls = setActionCalls;
  
  
  /**
   * Function that reduces Roll20 macro syntax formulas down to their calculated value.
   * @memberof Sheetworkers
   * @param {object} attributes - The attribute values of the character
   * @param {object[]} sections - All the repeating section IDs
   */
  const parseKFormula = ({trigger,attributes,sections,casc}) => {
    const [baseSection,rowID,attrName] = parseTriggerName(trigger.name);
    const repeatBlockRx = baseSection ?
      /(@{repeating_.+?_\$X_.+?})/g :
      /={([^)]*repeating_[^_]+[^)]*)}=/g;
    let mutFormula = trigger.formula;
    mutFormula = mutFormula.replace(repeatBlockRx,(match,repeatMacro) => {
      const [section] = repeatMacro.match(/repeating_[^_]+/);
      const idArray = baseSection ?
        [rowID] :
        sections[section];
      return idArray.map(id => {
          return `(${repeatMacro.replace(/repeating_[^_]+?_[^_]+?_([^}]+)/g,`${section}_${id}_$1`)})`;
        }).join(
          trigger.type === 'number' ?
            ' + ' :
            ''
        );
    });
    mutFormula = parseMacro(mutFormula,attributes)
      .replace(/@{.+?}/g,'0');
    const mathKeys = ['floor','ceil','round','abs'];
    mathKeys.forEach(func => mutFormula = mutFormula.replace(new RegExp(`${func}\\(`,'g'),`Math.${func}(`));
    const mathRx = new RegExp(`Math\\.(?:${mathKeys.join('|')})`,'g');
    let noAlphaStr = mutFormula
      .replace(mathRx,'');
    return trigger.type !== 'text' ?
      (
        !noAlphaStr.match(/[a-z]/i) ?
          eval(mutFormula) :
          undefined
      ) :
      mutFormula;
  };
  funcs.parseKFormula = parseKFormula;
  kFuncs.parseKFormula = parseKFormula;
  
  /**
   * Function to call a function previously registered to the funcs object. May not be used that much in actual sheets, but very useful when writing unit tests for your sheet. Either returns the function or null if no function exists.
   * @memberof Sheetworkers
   * @param {string} funcName - The name of the function to invoke.
   * @param {...any} args - The arguments to call the function with.
   * @returns {function|null}
   * @example
   * //Call myFunc with two arguments
   * k.callFunc('myFunc','an argument','another argument');
   */
  const callFunc = function(funcName,...args){
    if(funcs[funcName]){
      if(kFuncs.verboseMode){
        debug(`calling ${funcName}`);
      }
      return funcs[funcName](...args);
    }else{
      debug(`Invalid function name: ${funcName}`);
      return null;
    }
  };
  kFuncs.callFunc = callFunc;/**@namespace Sheetworkers */
/*jshint esversion: 11, laxcomma:true, eqeqeq:true*/
/*jshint -W014,-W084,-W030,-W033*/
//Sheet Updaters and styling functions
/**
 * Function that calls the K-scaffold's update and sheet initialization routines.
 */
const updateSheet = function(){
  log('updating sheet');
  getAllAttrs({props:['debug_mode',...baseGet],callback:(attributes,sections,casc)=>{
    kFuncs.debugMode = kFuncs.debugMode || !!attributes.debug_mode;
    if(kFuncs.verboseMode){
      debug({sheet_version:attributes.sheet_version});
    }
    if(!attributes.sheet_version){
      Object.entries(initialSetups).forEach(([funcName,handler])=>{
        if(typeof funcs[funcName] === 'function'){
          if(kFuncs.verboseMode){
            debug(`running ${funcName}`);
          }
          funcs[funcName]({attributes,sections,casc});
        }else{
          if(kFuncs.verboseMode){
            debug(`!!!Warning!!! no function named ${funcName} found. Initial sheet setup not performed.`);
          }
        }
      });
    }else{
      Object.entries(updateHandlers).forEach(([ver,handler])=>{
        if(attributes.sheet_version < +ver){
          handler({attributes,sections,casc});
        }
      });
    }
    if(kFuncs.verboseMode){
      debug({openHandlers});
    }
    Object.entries(openHandlers).forEach(([funcName,func])=>{
      if(typeof funcs[funcName] === 'function'){
        if(kFuncs.verboseMode){
          debug(`running ${funcName}`);
        }
        funcs[funcName]({attributes,sections,casc});
      }else{
        if(kFuncs.verboseMode){
          debug(`!!!Warning!!! no function named ${funcName} found. Sheet open handling not performed.`);
        }
      }
    });
    setActionCalls({attributes,sections});
    attributes.sheet_version = kFuncs.version;
    log(`Sheet Update applied. Current Sheet Version ${kFuncs.version}`);
    attributes.set();
    log('Sheet ready for use');
  }});
};
kFuncs.updateSheet = updateSheet;

const initialSetup = function(attributes,sections){
  if(kFuncs.verboseMode){
    debug('Initial sheet setup');
  }
};

/**
 * This is the default listener function for attributes that the K-Scaffold uses. It utilizes the `triggerFuncs`, `listenerFunc`, `calculation`, and `affects` properties of the K-scaffold trigger object (see the Pug section of the scaffold for more details).
 * @memberof Sheetworkers
 * @param {Roll20Event} event - The Roll20 event object
 * @returns {void}
 * @example
 * //Call from an attribute change
 * on('change:an_attribute',k.accessSheet);
 */
const accessSheet = function(event){
  if(kFuncs.verboseMode){
    debug({funcs:Object.keys(funcs)});
    debug({event});
  }
  getAllAttrs({callback:(attributes,sections,casc)=>{
    let trigger = attributes.getCascObj(event,casc);
    attributes.processChange({event,trigger,attributes,sections,casc});
  }});
};
funcs.accessSheet = accessSheet;/*jshint esversion: 11, laxcomma:true, eqeqeq:true*/
/*jshint -W014,-W084,-W030,-W033*/
/*
Cascade Expansion functions
*/
//Expands the repeating section templates in cascades to reflect the rows actually available
const expandCascade = function(cascade,sections){
  return _.keys(cascade).reduce((memo,key)=>{//iterate through cascades and replace references to repeating attributes with correct row ids.
    if(/^(?:act|attr)_repeating_/.test(key)){//If the attribute is a repeating attribute, do special logic
      expandRepeating(memo,key,cascade,sections);
    }else if(key){//for non repeating attributes do this logic
      expandNormal(memo,key,cascade,sections);
    }
    return memo;
  },{});
};
kFuncs.expandCascade = (sections) => expandCascade(cascades,sections);

const expandRepeating = function(memo,key,cascade,sections){
  key.replace(/((?:attr|act)_)(repeating_[^_]+)_[^_]+?_(.+)/,(match,type,section,field)=>{
    (sections[section]||[]).forEach((id)=>{
      memo[`${type}${section}_${id}_${field}`]=_.clone(cascade[key]);//clone the details so that each row's attributes have correct ids
      memo[`${type}${section}_${id}_${field}`].name = `${section}_${id}_${field}`;
      if(key.startsWith('attr_')){
        memo[`${type}${section}_${id}_${field}`].affects = memo[`${type}${section}_${id}_${field}`].affects.reduce((m,affected)=>{
          if(affected.startsWith(section)){//otherwise if the affected attribute is in the same section, simply set the affected attribute to have the same row id.
            m.push(applyID(affected,id));
          }else if(/repeating/.test(affected)){//If the affected attribute isn't in the same repeating section but is still a repeating attribute, add all the rows of that section
            addAllRows(affected,m,sections);
          }else{//otherwise the affected attribute is a non repeating attribute. Simply add it to the computed affected array
            m.push(affected);
          }
          return m;
        },[]);
      }
    });
  });
};

const applyID = function(affected,id){
  return affected.replace(/(repeating_[^_]+_)[^_]+(.+)/,`$1${id}$2`);
};

const expandNormal = function(memo,key,cascade,sections){
  memo[key] = _.clone(cascade[key]);
  if(key.startsWith('attr_')){
    memo[key].affects = memo[key].affects || [];
    memo[key].affects = memo[key].affects.reduce((m,a)=>{
      if(/^repeating/.test(a)){
        addAllRows(a,m,sections);
      }else{
        m.push(a);
      }
      return m;
    },[]);
  }
};

const addAllRows = function(affected,memo,sections){
  affected.replace(/(repeating_[^_]+?)_[^_]+?_(.+)/,(match,section,field)=>{
    sections[section].forEach(id=>memo.push(`${section}_${id}_${field}`));
  });
};/*jshint esversion: 11, laxcomma:true, eqeqeq:true*/
/*jshint -W014,-W084,-W030,-W033*/
/**
 * These are functions that provide K-scaffold aliases for the basic Roll20 sheetworker functions. These functions also provide many additional features on top of the standard Roll20 sheetworkers.
 * @namespace Sheetworkers.Sheetworker Aliases
 */
/**
 * Alias for [setSectionOrder()](https://wiki.roll20.net/Sheet_Worker_Scripts#setSectionOrder.28.3CRepeating_Section_Name.3E.2C_.3CSection_Array.3E.2C_.3CCallback.3E.29) that allows you to use the section name in either `repeating_section` or `section` formats. Note that the Roll20 sheetworker [setSectionOrder](https://wiki.roll20.net/Sheet_Worker_Scripts#setSectionOrder.28.3CRepeating_Section_Name.3E.2C_.3CSection_Array.3E.2C_.3CCallback.3E.29) currently causes some display issues on sheets.
 * @memberof Sheetworker Aliases
 * @name setSectionOrder
 * @param {string} section - The name of the section, with or without `repeating_`
 * @param {string[]} order - Array of ids describing the desired order of the section.
 * @returns {void}
 * @example
 * //Set the order of a repeating_weapon section
 * k.setSectionOrder('repeating_equipment',['id1','id2','id3']);
 * //Can also specify the section name without the repeating_ prefix
 * k.setSectionOrder('equipment',['id1','id2','id3']);
 */
const _setSectionOrder = function(section,order){
  let trueSection = section.replace(/repeating_/,'');
  setSectionOrder(trueSection,order);
};
// deprecation warning added to setSectionOrder
kFuncs.setSectionOrder = (section,order) => {
  debug('###Deprecation: It is recommended to use the "move" method of the nested section info feature of the attributes object instead of setSectionOrder');
  _setSectionOrder(section,order);
};

/**
 * Alias for [removeRepeatingRow](https://wiki.roll20.net/Sheet_Worker_Scripts#removeRepeatingRow.28_RowID_.29) that also removes the row from the current object of attribute values and array of section IDs to ensure that erroneous updates are not issued.
 * @memberof Sheetworker Aliases
 * @name removeRepeatingRow
 * @param {string} row - The row id to be removed
 * @param {attributesProxy} attributes - The attribute values currently in memory
 * @param {object} sections - Object that contains arrays of all the IDs in sections on the sheet indexed by repeating name.
 * @returns {void}
 * @example
 * //Remove a repeating Row
 * k.getAllAttrs({
 *  callback:(attributes,sections)=>{
 *    const rowID = sections.repeating_equipment[0];
 *    k.removeRepeatingRow(`repeating_equipment_${rowID}`,attributes,sections);
 *    console.log(sections.repeating_equipment); // => rowID no longer exists in the array.
 *    console.log(attributes[`repeating_equipment_${rowID}_name`]); // => undefined
 *  }
 * })
 */
const _removeRepeatingRow = function(row,attributes,sections){
  Object.keys(attributes.attributes).forEach((key)=>{
    if(key.startsWith(row)){
      delete attributes[key];
    }
  });
  let [,section,rowID] = row.match(/(repeating_[^_]+)_(.+)/,'');
  sections[section] = sections[section].filter((id)=>id!==rowID);
  delete attributes[section][rowID];
  removeRepeatingRow(row);
};
kFuncs.removeRepeatingRow = _removeRepeatingRow;

/**
 * Alias for [getAttrs()](https://wiki.roll20.net/Sheet_Worker_Scripts#getAttrs.28attributeNameArray.2C_callback.29) that converts the default object of attribute values into an {@link attributesProxy} and passes that back to the callback function.
 * @memberof Sheetworker Aliases
 * @name getAttrs
 * @param {string[]} [props=baseGet] - Array of attribute names to get the value of. Defaults to {@link baseGet} if not passed.
 * @param {function(attributesProxy)} callback - The function to call after the attribute values have been gotten. An {@link attributesProxy} is passed to the callback.
 * @example
 * //Gets the attributes named in props.
 * k.getAttrs({
 *  props:['attribute_1','attribute_2'],
 *  callback:(attributes)=>{
 *    //Work with the attributes as you would in a normal getAttrs, or use the superpowers of the K-scaffold attributes object like so:
 *    attributes.attribute_1 = 'new value';
 *    attributes.set();
 *  }
 * })
 */
const _getAttrs = function({props=baseGet,callback}){
  getAttrs(props,(values)=>{
    const attributes = createAttrProxy(values);
    callback(attributes);
  });
};
kFuncs.getAttrs = _getAttrs;

/**
 * Alias for [getAttrs()](https://wiki.roll20.net/Sheet_Worker_Scripts#getAttrs.28attributeNameArray.2C_callback.29) and [getSectionIDs](https://wiki.roll20.net/Sheet_Worker_Scripts#getSectionIDs.28section_name.2Ccallback.29) that combines the actions of both sheetworker functions and converts the default object of attribute values into an {@link attributesProxy}. Also gets the details on how to handle all attributes from the master {@link cascades} object and.
 * @memberof Sheetworker Aliases
 * @param {Object} args
 * @param {string[]} [args.props=baseGet] - Array of attribute names to get the value of. Defaults to {@link baseGet} if not passed.
 * @param {repeatingSectionDetails} sectionDetails - Array of details about a section to get the IDs for and attributes that need to be gotten. 
 * @param {function(attributesProxy,sectionObj,expandedCascade):void} args.callback - The function to call after the attribute values have been gotten. An {@link attributesProxy} is passed to the callback along with a {@link sectionObj} and {@link expandedCascade}.
 * @example
 * //Get every K-scaffold linked attribute on the sheet
 * k.getAllAttrs({
 *  callback:(attributes,sections,casc)=>{
 *    //Work with the attributes as you please.
 *    attributes.some_attribute = 'a value';
 *    attributes.set();//Apply our change
 *  }
 * })
 */
const getAllAttrs = function({props=baseGet,sectionDetails=repeatingSectionDetails,callback}){
  getSections(sectionDetails,(repeats,sections)=>{
    getAttrs([...props,...repeats],(values)=>{
      const casc = expandCascade(cascades,sections);
      const attributes = createAttrProxy(values,sections,casc);
      orderSections(attributes,sections,casc);
      callback(attributes,sections,casc);
    })
  });
};
kFuncs.getAllAttrs = getAllAttrs;

/**
 * Alias for [getSectionIDs()](https://wiki.roll20.net/Sheet_Worker_Scripts#getSectionIDs.28section_name.2Ccallback.29) that allows you to iterate through several functions at once. Also assembles an array of repeating attributes to get.
 * @memberof Sheetworker Aliases
 * @param {object[]} sectionDetails - Array of details about a section to get the IDs for and attributes that need to be gotten.
 * @param {string} sectionDetails.section - The full name of the repeating section including the `repeating_` prefix.
 * @param {string[]} sectionDetails.fields - Array of field names that need to be gotten from the repeating section
 * @param {function(string[],sectionObj)} callback - The function to call once all IDs have been gotten and the array of repating attributes to get has been assembled. The callback is passed the array of repating attributes to get and a {@link sectionObj}.
 * @example
 * // Get some section details
 * const sectionDetails = {
 *  {section:'repeating_equipment',fields:['name','weight','cost']},
 *  {section:'repeating_weapon',fields:['name','attack','damage']}
 * };
 * k.getSections(sectionDetails,(attributeNames,sections)=>{
 *  console.log(attributeNames);// => Array containing all row specific attribute names
 *  console.log(sections);// => Object with arrays containing the row ids. Indexed by section name (e.g. repeating_eqiupment)
 * })
 */
const getSections = function(sectionDetails,callback){
  let queueClone = _.clone(sectionDetails);
  const worker = (queue,repeatAttrs=[],sections={})=>{
    let detail = queue.shift();
    getSectionIDs(detail.section,(IDs)=>{
      sections[detail.section] = IDs;
      IDs.forEach((id)=>{
        detail.fields.forEach((f)=>{
          repeatAttrs.push(`${detail.section}_${id}_${f}`);
        });
      });
      repeatAttrs.push(`_reporder_${detail.section}`);
      if(queue.length){
        worker(queue,repeatAttrs,sections);
      }else{
        callback(repeatAttrs,sections);
      }
    });
  };
  if(!queueClone[0]){
    callback([],{});
  }else{
    worker(queueClone);
  }
};
kFuncs.getSections = getSections;

// Sets the attributes while always calling with {silent:true}
// Can be awaited to get the values returned from _setAttrs
/**
 * Alias for [setAttrs()](https://wiki.roll20.net/Sheet_Worker_Scripts#setAttrs.28values.2Coptions.2Ccallback.29) that sets silently by default.
 * @memberof Sheetworker Aliases
 * @alias setAttrs
 * @param {object} obj - The object containting attributes to set
 * @param {boolean} [vocal=false] - Whether to set silently (default value) or not.
 * @param {function()} [callback] - The callback function to invoke after the setting has been completed. No arguments are passed to the callback function.
 * @example
 * //Set some attributes silently
 * k.setAttrs({attribute_1:'new value'})
 * //Set some attributes and triggers listeners
 * k.setAttrs({attribute_1:'new value',true})
 * //Set some attributes and call a callback function
 * k.setAttrs({attribute_1:'new value'},null,()=>{
 *  //Do something after the attribute is set
 * })
 */
const set = function(obj,vocal=false,callback){
  setAttrs(obj,{silent:!vocal},callback);
};
kFuncs.setAttrs = set;

const generateCustomID = function(string){
  if(!string.startsWith('-')){
    string = `-${string}`;
  }
  rowID = generateRowID();
  let re = new RegExp(`^.{${string.length}}`);
  return `${string}${rowID.replace(re,'')}`;
};


/**
 * Alias for generateRowID that adds the new id to the {@link sectionObj}. Also allows for creation of custom IDs that conform to the section ID requirements.
 * @memberof Sheetworker Aliases
 * @name generateRowID
 * @param {sectionObj} sections
 * @param {string} [customText] - Custom text to start the ID with. This text should not be longer than the standard repeating section ID format.
 * @returns {string} - The created ID
 * @example
 * k.getAllAttrs({
 *  callback:(attributes,sections,casc)=>{
 *    //Create a new row ID
 *    const rowID = k.generateRowID('repeating_equipment',sections);
 *    console.log(rowID);// => repeating_equipment_-p8rg908ug0suzz
 *    //Create a custom row ID
 *    const customID = k.generateRowID('repeating_equipment',sections,'custom');
 *    console.log(customID);// => repeating_equipment_-custom98uadj89kj
 *  }
 * });
 */
const _generateRowID = function(section,sections,customText){
  let rowID = customText ?
    generateCustomID(customText) :
    generateRowID();
  section = section.match(/^repeating_[^_]+$/) ?
    section :
    `repeating_${section}`;
  sections[section] = sections[section] || [];
  sections[section].push(rowID);
  return `${section}_${rowID}`;
};
kFuncs.generateRowID = (section,sections,customText) => {
  debug('###Deprecation: It is recommended to use the "create" method of the nested section info feature of the attributes object instead of k.generateRowID');
  return _generateRowID(section,sections,customText);
};

/**
 * An alias for [Roll20's getTranslationByKey](https://wiki.roll20.net/Sheet_Worker_Scripts#getTranslationByKey.28.5Bkey.5D.29) that also supports data-i18n-vars syntax replacement and returns the translation key if no value is found instead of `false`.
 * @memberof Sheetworker Aliases
 * @name getTranslationByKey
 * @param {string} key - The translation key to look up.
 * @param {string[]} [variables = []] - An array of variable values to replace variable indexes with.
 * @returns {string}
 */
const _getTranslationByKey = (key,variables = []) => {
  let translate = getTranslationByKey(key) || key;
  console.warn('getTranslationByKey',getTranslationByKey(key));
  console.warn('translate:',translate);
  variables.forEach((v,i) => {
    translate = translate.replace(new RegExp(`\\{\\{${i}\\}\\}`,'g'),v);
  });
  return translate;
}
kFuncs.getTranslationByKey = _getTranslationByKey;

/**
 * Assembles the roll string from the roll object
 * @param {object} rollObj - object describing the roll
 * @param {string} [rollStart = '@{template_start}'] - The string to start the roll with.
 * @returns {string}
 */
const assembleRoll = (rollObj,rollStart = kFuncs.defaultRollStart) => {
  return Object.entries(rollObj).reduce((str,[field,content])=>{
    return str += ` {{${field}=${content ?? ''}}}`;
  },`${rollStart}`);
};


/**
 * @typedef {Object} kRoll
 * @property {Object} roll - The roll object returned by [Roll20's startRoll](https://wiki.roll20.net/Custom_Roll_Parsing#Sheetworker_Functions).
 * @property {Function} roll.finish - Finishes the associated roll passing it the computeObj and rollId.
 * @property {Object} computeObj - object for storing manipulations to the roll. Assign manipulations to this, DO NOT reassign it to a new object.
 */

/**
 * 
 * @param {object} rollObj - Object specifying the fields to pass to the rolltemplate. Object keys are field names. Object values are the field values.
 * @param {string} [startString = '@{template_start}'] - Text that should be prepended to the roll string that results from rollObj.
 * @returns {kRoll} 
 */
const _startRoll = async (rollObj,startString) => {
  const rollString = assembleRoll(rollObj,startString);
  const roll = await startRoll(rollString);
  const computeObj = {};
  roll.finish = () => {
    finishRoll(roll.rollId,computeObj);
  };
  return {roll, computeObj};
};
kFuncs.startRoll = _startRoll;/*jshint esversion: 11, laxcomma:true, eqeqeq:true*/
/*jshint -W014,-W084,-W030,-W033*/
const listeners = {};

/**
 * The array of attribute names that the k-scaffold gets by default. Does not incude repeating attributes.
 * @memberof Variables
 * @var
 * @type {array}
 */
const baseGet = Object.entries(cascades).reduce((memo,[attrName,detailObj])=>{
  if(!/repeating/.test(attrName) && detailObj.type !== 'action'){
    memo.push(detailObj.name);
  }
  if(detailObj.listener){
    listeners[detailObj.listener] = detailObj.listenerFunc;
  }
  return memo;
},[]);
kFuncs.baseGet = baseGet;

const registerEventHandlers = function(){
  on('sheet:opened',updateSheet);
  if(kFuncs.verboseMode){
    debug({funcKeys:Object.keys(funcs),funcs});
  }
  //Roll20 change and click listeners
  Object.entries(listeners).forEach(([event,funcName])=>{
    if(funcs[funcName]){
      on(event,funcs[funcName]);
    }else{
      debug(`!!!Warning!!! no function named ${funcName} found. No listener created for ${event}`,true);
    }
  });
  log(`kScaffold Loaded`);
};
setTimeout(registerEventHandlers,0);//Delay the execution of event registration to ensure all event properties are present.

/**
 * Function to add a repeating section when the add button of a customControlFieldset or inlineFieldset is clicked.
 * @memberof Sheetworkers
 * @param {object} event - The R20 event object
 */
const addItem = function(event){
  let [,,section] = parseClickTrigger(event.triggerName);
  section = section.replace(/add-/,'');
  getAllAttrs({
    callback:(attributes,sections,casc) => {
      let row = _generateRowID(section,sections);
      attributes[`${row}_name`] = '';
      setActionCalls({attributes,sections});
      const trigger = cascades[`fieldset_repeating_${section}`];
      if(trigger){
        if(trigger.addFuncs){
          trigger.addFuncs.forEach((funcName) => {
            if(funcs[funcName]){
              funcs[funcName]({attributes,sections,casc,trigger,newRow:row});
            }
          });
        }
        if(Array.isArray(trigger.affects)){
          attributes.queue.push(...trigger.affects);
        }
      }
      attributes.set({attributes,sections,casc});
    }
  });
};
funcs.addItem = addItem;/**
 * The default tab navigation function of the K-scaffold. Courtesy of Riernar. It will add `k-active-tab` to the active tab-container and `k-active-button` to the active button. You can either write your own CSS to control display of these, or use the default CSS included in `scaffold/_k.scss`. Note that `k-active-button` has no default CSS as it is assumed that you will want to style the active button to match your system.
 * @memberof Sheetworkers
 * @param {Object} trigger - The trigger object
 * @param {object} attributes - The attribute values of the character
 */
const kSwitchTab = function ({ trigger, attributes }) {
  const [container, tab] = (
    trigger.name.match(/nav-tabs-(.+)--(.+)/) ||
    []
  ).slice(1);
  $20(`[data-container-tab="${container}"]`).removeClass('k-active-tab');
  $20(`[data-container-tab="${container}"][data-tab="${tab}"]`).addClass('k-active-tab');
  $20(`[data-container-button="${container}"]`).removeClass('k-active-button');
  $20(`[data-container-button="${container}"][data-button="${tab}"]`).addClass('k-active-button');
  const tabInputName = `${container.replace(/\-/g,'_')}_tab`;
  if(persistentTabs.indexOf(tabInputName) > -1){
    attributes[tabInputName] = trigger.name;
  }
}

registerFuncs({ kSwitchTab });

/**
 * Sets persistent tabs to their last active state
 * @memberof Sheetworkers
 * @param {object} attributes - The attribute values of the character
 */
const kTabOnOpen = function({trigger,attributes,sections,casc}){
  if(typeof persistentTabs === 'undefined') return;
  persistentTabs.forEach((tabInput) => {
    const pseudoTrigger = {name:attributes[tabInput]};
    kSwitchTab({trigger:pseudoTrigger, attributes});
  });
};
registerFuncs({ kTabOnOpen },{type:['opener']});
  return kFuncs;
  }());
  const actionAttributes = [];

console.debug = vi.fn(a => null);
console.log = vi.fn(a => null);
console.table = vi.fn(a => null);
module.exports = {k,...global};