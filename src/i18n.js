export const T = {
en:{title:'Durian Farm Manager',trees:'Trees',categories:'Categories',types:'Types',spendings:'Spending',logs:'Tree Log',reports:'Reports',
code:'Tree No.',note:'Note',name:'Name',category_id:'Category',type_id:'Type',tree_id:'Tree',date:'Date',kg:'Amount (KG)',
price_per_kg:'Price / KG',amount:'Total amount',kind:'Record type',sickness:'Sickness',medicine:'Medicine',fruit_count:'Fruit count',
weight_kg:'Total fruit weight (KG)',fertilizer:'Fertilizer',sick:'Sick',flower:'Flower',fruit:'Fruit',save:'Save',cancel:'Cancel',
edit:'Edit',delete:'Delete',bulk:'Add many trees',prefix:'Prefix',start:'From',end:'To',period:'Period',day:'Day',week:'Week',month:'Month',
year:'Year',total:'Total',avgw:'Average fruit weight (KG)',price:'Selling price / KG',income:'Income',totalcount:'Total fruit',
totalkg:'Total weight (KG)',confirm:'Delete this?',pertree:'Fruit per tree',bycat:'By category',err:'Already exists'},
km:{title:'ប្រព័ន្ធគ្រប់គ្រងចម្ការទុរេន',trees:'ដើមទុរេន',categories:'ក្រុមចំណាយ',types:'ប្រភេទរង',spendings:'ចំណាយ',logs:'កំណត់ត្រាដើម',reports:'របាយការណ៍',
code:'លេខដើម',note:'កំណត់ចំណាំ',name:'ឈ្មោះ',category_id:'ក្រុម',type_id:'ប្រភេទ',tree_id:'ដើមទុរេន',date:'កាលបរិច្ឆេទ',kg:'ចំនួន (គីឡូ)',
price_per_kg:'តម្លៃ/គីឡូ',amount:'ទឹកប្រាក់សរុប',kind:'ប្រភេទកំណត់ត្រា',sickness:'ជំងឺ',medicine:'ថ្នាំ',fruit_count:'ចំនួនផ្លែ',
weight_kg:'ទម្ងន់ផ្លែសរុប (គីឡូ)',fertilizer:'ដាក់ជី',sick:'ឈឺ',flower:'ចេញផ្កា',fruit:'ចេញផ្លែ',save:'រក្សាទុក',cancel:'បោះបង់',
edit:'កែ',delete:'លុប',bulk:'បន្ថែមដើមច្រើន',prefix:'អក្សរនាំមុខ',start:'ចាប់ពី',end:'ដល់',period:'រយៈពេល',day:'ថ្ងៃ',week:'សប្តាហ៍',month:'ខែ',
year:'ឆ្នាំ',total:'សរុប',avgw:'ទម្ងន់ផ្លែជាមធ្យម (គីឡូ)',price:'តម្លៃលក់/គីឡូ',income:'ចំណូល',totalcount:'ចំនួនផ្លែសរុប',
totalkg:'ទម្ងន់សរុប (គីឡូ)',confirm:'លុបមែនទេ?',pertree:'ចំនួនផ្លែតាមដើម',bycat:'តាមក្រុម',err:'មានរួចហើយ'}};
Object.assign(T.en,{dash:'Dashboard',add:'Add',search:'Search...',empty:'No data yet. Press + Add to start.',trees_total:'Total trees',
spend_total:'Total spending',spend_month:'This month',sick_now:'Sick trees (30 days)',recent:'Recent activity',trend:'Spending by month',
conn:'Cannot connect to the backend',retry:'Retry',saved:'Saved',deleted:'Deleted',income_est:'Estimated income',fruit_total:'Total fruit',
connhelp:'Start the backend, then press Retry:'});
Object.assign(T.km,{dash:'ផ្ទាំងគ្រប់គ្រង',add:'បន្ថែម',search:'ស្វែងរក...',empty:'មិនទាន់មានទិន្នន័យ។ ចុច + បន្ថែម ដើម្បីចាប់ផ្តើម។',trees_total:'ដើមទុរេនសរុប',
spend_total:'ចំណាយសរុប',spend_month:'ខែនេះ',sick_now:'ដើមឈឺ (៣០ថ្ងៃ)',recent:'សកម្មភាពថ្មីៗ',trend:'ចំណាយតាមខែ',
conn:'មិនអាចភ្ជាប់ទៅ Backend បានទេ',retry:'ព្យាយាមម្តងទៀត',saved:'បានរក្សាទុក',deleted:'បានលុប',income_est:'ចំណូលប៉ាន់ស្មាន',fruit_total:'ផ្លែសរុប',
connhelp:'សូមបើក Backend រួចចុចព្យាយាមម្តងទៀត៖'});
import {createContext} from 'react';export const LangCtx=createContext({t:k=>k});
Object.assign(T.en, {
  settings: 'Settings', login: 'Sign in', username: 'Username', password: 'Password', logout: 'Log out',
  show: 'Show', hide: 'Hide', send_otp: 'Send code to my email', otp_sent: 'Code sent to', otp: 'Code from email (6 digits)',
  old_pw: 'Current password', new_pw: 'New password', confirm_pw: 'Repeat new password', change_pw: 'Change password',
  r_len: 'At least 12 characters', r_up: 'Capital letter (A-Z)', r_low: 'Small letter (a-z)', r_dig: 'Number (0-9)',
  r_sym: 'Symbol (! @ # $ ...)', mismatch: 'Passwords do not match', pw_changed: 'Password changed',
  step1: 'Step 1: get a code by email', step2: 'Step 2: enter the code and new password', account: 'Account',
  e_bad_login: 'Wrong username or password', e_locked: 'Too many tries. Wait 10 minutes.', e_otp_wrong: 'Wrong code',
  e_otp_expired: 'Code expired. Send a new one.', e_weak: 'Password is too weak', e_wait: 'Please wait 1 minute before asking again',
  e_old_wrong: 'Current password is wrong', e_mail_fail: 'Could not send the email',
})
Object.assign(T.km, {
  settings: 'ការកំណត់', login: 'ចូលប្រព័ន្ធ', username: 'ឈ្មោះអ្នកប្រើ', password: 'ពាក្យសម្ងាត់', logout: 'ចាកចេញ',
  show: 'បង្ហាញ', hide: 'លាក់', send_otp: 'ផ្ញើកូដទៅអ៊ីមែលរបស់ខ្ញុំ', otp_sent: 'បានផ្ញើកូដទៅ', otp: 'កូដពីអ៊ីមែល (៦ខ្ទង់)',
  old_pw: 'ពាក្យសម្ងាត់បច្ចុប្បន្ន', new_pw: 'ពាក្យសម្ងាត់ថ្មី', confirm_pw: 'វាយពាក្យសម្ងាត់ថ្មីម្តងទៀត', change_pw: 'ប្តូរពាក្យសម្ងាត់',
  r_len: 'យ៉ាងតិច ១២ តួអក្សរ', r_up: 'អក្សរធំ (A-Z)', r_low: 'អក្សរតូច (a-z)', r_dig: 'លេខ (0-9)',
  r_sym: 'និមិត្តសញ្ញា (! @ # $ ...)', mismatch: 'ពាក្យសម្ងាត់មិនដូចគ្នា', pw_changed: 'បានប្តូរពាក្យសម្ងាត់',
  step1: 'ជំហាន ១៖ ទទួលកូដតាមអ៊ីមែល', step2: 'ជំហាន ២៖ បញ្ចូលកូដ និងពាក្យសម្ងាត់ថ្មី', account: 'គណនី',
  e_bad_login: 'ឈ្មោះអ្នកប្រើ ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ', e_locked: 'ព្យាយាមច្រើនពេក។ សូមរង់ចាំ ១០ នាទី។', e_otp_wrong: 'កូដមិនត្រឹមត្រូវ',
  e_otp_expired: 'កូដផុតកំណត់។ សូមផ្ញើកូដថ្មី។', e_weak: 'ពាក្យសម្ងាត់ខ្សោយពេក', e_wait: 'សូមរង់ចាំ ១ នាទី មុនសុំម្តងទៀត',
  e_old_wrong: 'ពាក្យសម្ងាត់បច្ចុប្បន្នមិនត្រឹមត្រូវ', e_mail_fail: 'មិនអាចផ្ញើអ៊ីមែលបានទេ',
})
Object.assign(T.en, {
  waking: 'Server is waking up, please wait up to a minute...',
  sort: 'Sort', s_asc: 'Number 1 → 9', s_desc: 'Number 9 → 1', s_new: 'Newest added', s_note: 'With note first',
  how_many: 'How many trees to add?', add_trees: 'Add trees', stat_last: 'Last number', stat_gaps: 'Missing numbers',
  gaps_title: 'Missing numbers found', gaps_text: 'These numbers are empty. Fill them first? Tap a number to select or unselect.',
  will_add: 'Will add', fill_sel: 'Yes, fill the selected numbers', no_cont: 'No, continue from', select_all: 'Select all',
  pw_title: 'Enter your password to continue', confirm: 'Confirm', del_tree: 'Delete tree',
  del_warn: 'This tree will be removed and its number becomes empty.', added: 'Added',
  e_pw_wrong: 'Wrong password', e_count: 'Enter a number from 1 to 500',
})
Object.assign(T.km, {
  waking: 'ម៉ាស៊ីនបម្រើកំពុងភ្ញាក់ សូមរង់ចាំរហូតដល់ ១ នាទី...',
  sort: 'តម្រៀប', s_asc: 'លេខ តូច → ធំ', s_desc: 'លេខ ធំ → តូច', s_new: 'បន្ថែមថ្មីៗ', s_note: 'មានកំណត់ចំណាំមុន',
  how_many: 'បន្ថែមប៉ុន្មានដើម?', add_trees: 'បន្ថែមដើមទុរេន', stat_last: 'លេខចុងក្រោយ', stat_gaps: 'លេខដែលបាត់',
  gaps_title: 'រកឃើញលេខដែលបាត់', gaps_text: 'លេខទាំងនេះទំនេរ។ ចង់បំពេញមុនទេ? ចុចលើលេខ ដើម្បីជ្រើស ឬលុបការជ្រើស។',
  will_add: 'នឹងបន្ថែម', fill_sel: 'បាទ/ចាស បំពេញលេខដែលបានជ្រើស', no_cont: 'ទេ បន្តពីលេខ', select_all: 'ជ្រើសរើសទាំងអស់',
  pw_title: 'បញ្ចូលពាក្យសម្ងាត់ ដើម្បីបន្ត', confirm: 'បញ្ជាក់', del_tree: 'លុបដើមទុរេន',
  del_warn: 'ដើមនេះនឹងត្រូវលុប ហើយលេខរបស់វានឹងទំនេរ។', added: 'បានបន្ថែម',
  e_pw_wrong: 'ពាក្យសម្ងាត់មិនត្រឹមត្រូវ', e_count: 'បញ្ចូលលេខពី ១ ដល់ ៥០០',
})