const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Category = require('./models/Category');
const Customer = require('./models/Customer');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Customer.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Seed Users
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const users = [
      { id: '1', username: 'admin', password: await bcrypt.hash('admin123', 10), role: 'admin', name: 'ผู้ดูแลระบบ' },
      { id: '2', username: 'manager', password: await bcrypt.hash('manager123', 10), role: 'manager', name: 'ผู้จัดการ' },
      { id: '3', username: 'user', password: await bcrypt.hash('user123', 10), role: 'user', name: 'พนักงาน' },
      { id: '4', username: 'viewer', password: await bcrypt.hash('viewer123', 10), role: 'viewer', name: 'ผู้ชม' },
    ];
    await User.insertMany(users);
    console.log('✅ Users seeded');

    // Seed Sale Categories
    const saleCats = [
      { id: 'fostec', type: 'sale', label: 'FOSTEC', color: '#00d4ff', items: [
        { id: 'fim', label: 'FIM 4.0' }, { id: 'app', label: 'Application' }, { id: 'spc', label: 'SPC' }
      ]},
      { id: 'measure', type: 'sale', label: 'งานตรวจวัด', color: '#ff6b35', items: [
        { id: 'eff', label: 'Efficiency' }, { id: 'flow', label: 'Flow rate' },
        { id: 'qual', label: 'Quality' }, { id: 'dew', label: 'Dew point' },
        { id: 'oil', label: 'Oil vapor' }, { id: 'part', label: 'Particle' },
        { id: 'pres', label: 'Pressure' }, { id: 'enp', label: 'Energy power' },
      ]},
    ];
    await Category.insertMany(saleCats);
    console.log('✅ Sale categories seeded');

    // Seed Expense Categories
    const expCats = [
      { id: 'fix', type: 'expense', label: 'Fix cost', color: '#ff4757', items: [] },
      { id: 'office', type: 'expense', label: 'ค่าใช้จ่ายสำนักงาน', color: '#ffa502', items: [] },
      { id: 'rent', type: 'expense', label: 'ค่าเช่า', color: '#eccc68', items: [] },
      { id: 'fuel', type: 'expense', label: 'ค่าน้ำมันในการทำงาน', color: '#2ed573', items: [] },
      { id: 'job', type: 'expense', label: 'ค่าใช้จ่ายใน Job งาน', color: '#1e90ff', items: [] },
      { id: 'purchase', type: 'expense', label: 'สั่งซื้อสินค้า และเครื่องมือ', color: '#a29bfe', items: [] },
      { id: 'other', type: 'expense', label: 'ค่าใช้จ่ายอื่นๆ', color: '#fd79a8', items: [] },
    ];
    await Category.insertMany(expCats);
    console.log('✅ Expense categories seeded');

    // Seed Payment Categories
    const payCats = [
      { id: 'p_fostec', type: 'payment', label: 'FOSTEC', color: '#00d4ff', items: [
        { id: 'p_fim', label: 'FIM 4.0' }, { id: 'p_app', label: 'Application' }, { id: 'p_spc', label: 'SPC' }
      ]},
      { id: 'p_measure', type: 'payment', label: 'งานตรวจวัด', color: '#ff6b35', items: [
        { id: 'p_eff', label: 'Efficiency' }, { id: 'p_flow', label: 'Flow rate' },
        { id: 'p_qual', label: 'Quality' }, { id: 'p_dew', label: 'Dew point' },
        { id: 'p_oil', label: 'Oil vapor' }, { id: 'p_part', label: 'Particle' },
        { id: 'p_pres', label: 'Pressure' }, { id: 'p_enp', label: 'Energy power' },
      ]},
    ];
    await Category.insertMany(payCats);
    console.log('✅ Payment categories seeded');

    // Seed Customers
    const customers = [
      { id: 'cg1', label: 'ลูกค้าทั่วไป', color: '#00d4ff', items: [] },
    ];
    await Customer.insertMany(customers);
    console.log('✅ Customers seeded');

    console.log('🎉 Seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
