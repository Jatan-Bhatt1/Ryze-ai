/**
 * RYZE AI — Mock Agent (for users without API keys)
 * Provides pre-defined UI responses for common prompts.
 */

const MOCK_TEMPLATES = [
  {
    keywords: ['dashboard', 'analytics', 'admin'],
    plan: {
      layout: { type: 'sidebar-layout', description: 'Dashboard with sidebar navigation' },
      components: [
        { type: 'Sidebar', props: { title: 'Ryze Admin', items: [{ label: 'Overview', active: true, icon: '📊' }, { label: 'Users', icon: '👥' }, { label: 'Settings', icon: '⚙️' }] } },
        { type: 'Navbar', props: { brand: 'Dashboard', items: [{ label: 'Profile', href: '#' }] } },
        {
          type: 'div', props: { 'data-layout': 'grid-3', 'data-gap': 'md', 'data-padding': 'md' }, children: [
            { type: 'Card', props: { title: 'Total Revenue', variant: 'elevated' }, children: [{ type: 'h2', children: '$45,231' }, { type: 'p', children: '+20.1% from last month' }] },
            { type: 'Card', props: { title: 'Active Users', variant: 'elevated' }, children: [{ type: 'h2', children: '2,350' }, { type: 'p', children: '+180 this week' }] },
            { type: 'Card', props: { title: 'Sales', variant: 'elevated' }, children: [{ type: 'h2', children: '+12,234' }, { type: 'p', children: '+19% from last month' }] }
          ]
        },
        {
          type: 'div', props: { 'data-layout': 'grid-2', 'data-gap': 'md', 'data-padding': 'md' }, children: [
            { type: 'Card', props: { title: 'Overview', variant: 'outlined' }, children: [{ type: 'Chart', props: { type: 'bar', data: [{ label: 'Jan', value: 30 }, { label: 'Feb', value: 45 }, { label: 'Mar', value: 60 }] } }] },
            { type: 'Card', props: { title: 'Recent Activity', variant: 'outlined' }, children: [{ type: 'Table', props: { columns: [{ key: 'user', header: 'User' }, { key: 'status', header: 'Status' }], data: [{ user: 'Alice', status: 'Active' }, { user: 'Bob', status: 'Pending' }] } }] }
          ]
        }
      ]
    },
    code: `function Dashboard() {
  return (
    <div data-layout="sidebar-layout" style={{ height: '100vh' }}>
      <Sidebar 
        title="Ryze Admin" 
        items={[
          { label: 'Overview', active: true, icon: '📊' },
          { label: 'Users', icon: '👥' },
          { label: 'Settings', icon: '⚙️' }
        ]} 
      />
      <div data-layout="flex-col" style={{ flex: 1, overflow: 'auto' }}>
        <Navbar 
          brand="Dashboard" 
          items={[{ label: 'Profile', href: '#' }]} 
        />
        <div data-layout="grid-3" data-gap="md" data-padding="md">
          <Card title="Total Revenue" variant="elevated">
            <h2>$45,231</h2>
            <p style={{ color: '#22c55e' }}>+20.1% from last month</p>
          </Card>
          <Card title="Active Users" variant="elevated">
            <h2>2,350</h2>
            <p style={{ color: '#22c55e' }}>+180 this week</p>
          </Card>
          <Card title="Sales" variant="elevated">
            <h2>+12,234</h2>
            <p style={{ color: '#22c55e' }}>+19% from last month</p>
          </Card>
        </div>
        <div data-layout="grid-2" data-gap="md" data-padding="md">
          <Card title="Overview" variant="outlined">
            <Chart 
              type="bar" 
              data={[
                { label: 'Jan', value: 4000 },
                { label: 'Feb', value: 3000 }, 
                { label: 'Mar', value: 2000 },
                { label: 'Apr', value: 2780 },
                { label: 'May', value: 1890 },
                { label: 'Jun', value: 2390 },
              ]} 
              title="Monthly Revenue"
            />
          </Card>
          <Card title="Recent Activity" variant="outlined">
            <Table 
              columns={[
                { key: 'user', header: 'User' },
                { key: 'action', header: 'Action' },
                { key: 'date', header: 'Date' }
              ]} 
              data={[
                { user: 'Alice Smith', action: 'Login', date: '2 mins ago' },
                { user: 'Bob Jones', action: 'Purchase', date: '15 mins ago' },
                { user: 'Charlie Day', action: 'Logout', date: '1 hour ago' },
                { user: 'David lee', action: 'Update Profile', date: '2 hours ago' },
                { user: 'Eva Green', action: 'Login', date: '3 hours ago' }
              ]} 
              striped
            />
          </Card>
        </div>
      </div>
    </div>
  );
}`,
    explanation: "I've created a comprehensive dashboard layout. It features a sidebar for navigation, a top navbar for user profile access, and a main content area. The main area includes summary cards for key metrics (Revision, Users, Sales) and detailed charts and tables for deeper analysis. I used a grid layout to organize these elements efficiently."
  },
  {
    keywords: ['login', 'sign in', 'auth'],
    plan: {
      layout: { type: 'flex-col', description: 'Centered login form' },
      components: [
        { type: 'Card', props: { title: 'Welcome Back', subtitle: 'Please sign in to continue', variant: 'elevated', padding: 'lg' } }
      ]
    },
    code: `function LoginPage() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  return (
    <div data-layout="flex-col" data-align="center" data-padding="lg" style={{ height: '100vh', justifyContent: 'center' }}>
      <Card title="Welcome Back" subtitle="Please sign in to continue" variant="elevated" padding="lg">
        <div data-layout="flex-col" data-gap="md" style={{ width: '300px' }}>
          <Input 
            label="Email" 
            placeholder="john@example.com" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            icon="📧"
          />
          <Input 
            label="Password" 
            type="password" 
            placeholder="••••••••" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            icon="🔒"
          />
          <Button variant="primary" fullWidth>Sign In</Button>
          <div data-layout="flex-row" data-align="center" style={{ justifyContent: 'space-between' }}>
            <Button variant="ghost" size="sm">Forgot Password?</Button>
            <Button variant="ghost" size="sm">Sign Up</Button>
          </div>
        </div>
      </Card>
      <p style={{ marginTop: '20px', color: '#888' }}>&copy; 2024 Ryze AI Inc.</p>
    </div>
  );
}`,
    explanation: "I've designed a clean, centered login page. The core component is an elevated Card containing the login form. I included Input fields for email and password with appropriate icons, a primary 'Sign In' button for the main action, and secondary 'Forgot Password'/'Sign Up' links for navigation."
  },
  {
    keywords: ['landing', 'home', 'hero'],
    plan: {
      layout: { type: 'flex-col', description: 'Landing page with hero section' },
      components: []
    },
    code: `function LandingPage() {
  return (
    <div data-layout="flex-col" style={{ minHeight: '100vh' }}>
      <Navbar 
        brand="Ryze App" 
        items={[
          { label: 'Features', href: '#' },
          { label: 'Pricing', href: '#' },
          { label: 'About', href: '#' }
        ]} 
        actions={
          <div data-layout="flex-row" data-gap="sm">
            <Button variant="ghost">Log In</Button>
            <Button variant="primary">Get Started</Button>
          </div>
        }
      />
      
      <div data-layout="flex-col" data-align="center" data-padding="lg" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '16px', color: '#0f172a' }}>
          Build UI Faster with AI
        </h1>
        <p style={{ fontSize: '18px', color: '#64748b', maxWidth: '600px', marginBottom: '32px' }}>
          Turn natural language prompts into working React components instantly. No API key required for this demo!
        </p>
        <div data-layout="flex-row" data-gap="md">
          <Button variant="primary" size="lg" icon="🚀">Start Building</Button>
          <Button variant="outline" size="lg" icon="📚">Read Docs</Button>
        </div>
      </div>

      <div data-layout="grid-3" data-gap="lg" data-padding="lg" style={{ background: '#f8fafc' }}>
        <Card title="Deterministic" padding="lg">
          <p>Consistent output every time with our fixed component library.</p>
        </Card>
        <Card title="Secure" padding="lg">
          <p>Built-in safety checks and prompt injection protection.</p>
        </Card>
        <Card title="Fast" padding="lg">
          <p>Live preview updates instantly as you type.</p>
        </Card>
      </div>
      
      <div data-layout="flex-col" data-align="center" data-padding="lg" style={{ marginTop: 'auto', borderTop: '1px solid #e2e8f0' }}>
        <p style={{ color: '#94a3b8' }}>&copy; 2024 Ryze AI. All rights reserved.</p>
      </div>
    </div>
  );
}`,
    explanation: "I've created a modern landing page structure. It starts with a responsive Navbar, followed by a prominent Hero section with a clear value proposition and call-to-action buttons. I've also included a features grid using Cards to highlight key benefits, and a simple footer."
  },
  {
    keywords: ['kanban', 'board', 'tasks', 'todo'],
    plan: {
      layout: { type: 'grid-3', description: 'Kanban board with 3 columns' },
      components: [
        { type: 'div', props: { 'data-layout': 'flex-col', 'data-gap': 'md' }, children: [{ type: 'h3', children: 'To Do' }, { type: 'Card', props: { title: 'Research competitors', variant: 'outlined' } }] },
        { type: 'div', props: { 'data-layout': 'flex-col', 'data-gap': 'md' }, children: [{ type: 'h3', children: 'In Progress' }, { type: 'Card', props: { title: 'Design mockups', variant: 'elevated' } }] },
        { type: 'div', props: { 'data-layout': 'flex-col', 'data-gap': 'md' }, children: [{ type: 'h3', children: 'Done' }, { type: 'Card', props: { title: 'Initial setup', variant: 'default' } }] }
      ]
    },
    code: `function KanbanBoard() {
  const [tasks, setTasks] = React.useState([
    { id: 1, title: 'Research competitors', status: 'todo' },
    { id: 2, title: 'Draft proposal', status: 'todo' },
    { id: 3, title: 'Design mockups', status: 'in-progress' },
    { id: 4, title: 'Implement login', status: 'in-progress' },
    { id: 5, title: 'Setup GitHub repo', status: 'done' },
    { id: 6, title: 'Configure CI/CD', status: 'done' },
  ]);

  const moveTask = (id, newStatus) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const Column = ({ title, status, bg }) => (
    <div data-layout="flex-col" data-gap="md" style={{ background: bg, padding: '16px', borderRadius: '8px', minHeight: '400px' }}>
      <div data-layout="flex-row" data-align="center" style={{ justifyContent: 'space-between' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>{title}</h3>
        <span style={{ fontSize: '12px', background: 'rgba(0,0,0,0.1)', padding: '2px 8px', borderRadius: '12px' }}>
          {tasks.filter(t => t.status === status).length}
        </span>
      </div>
      {tasks.filter(t => t.status === status).map(task => (
        <Card key={task.id} variant="elevated" padding="sm">
          <p style={{ fontWeight: '500', marginBottom: '8px' }}>{task.title}</p>
          <div data-layout="flex-row" data-gap="sm" style={{ justifyContent: 'flex-end' }}>
            {status !== 'todo' && <Button size="sm" variant="ghost" onClick={() => moveTask(task.id, 'todo')}>←</Button>}
            {status !== 'done' && <Button size="sm" variant="ghost" onClick={() => moveTask(task.id, 'done')}>→</Button>}
          </div>
        </Card>
      ))}
      <Button variant="ghost" fullWidth icon="+">Add Task</Button>
    </div>
  );

  return (
    <div data-layout="flex-col" style={{ height: '100vh' }}>
      <Navbar brand="Project Board" items={[{ label: 'Sprints', active: true }, { label: 'Backlog' }]} />
      <div data-layout="grid-3" data-gap="lg" data-padding="lg" style={{ flex: 1, overflow: 'auto', background: '#f8fafc' }}>
        <Column title="To Do" status="todo" bg="#f1f5f9" />
        <Column title="In Progress" status="in-progress" bg="#e0e7ff" />
        <Column title="Done" status="done" bg="#dcfce7" />
      </div>
    </div>
  );
}`,
    explanation: "I've implemented a fully interactive Kanban board. It uses a 3-column grid layout for 'To Do', 'In Progress', and 'Done'. Each task is rendered as a Card component. I added state management so you can move tasks between columns using the arrow buttons, demonstrating how the AI can build functional, interactive logic."
  },
  {
    keywords: ['product', 'list', 'ecommerce', 'shop'],
    plan: {
      layout: { type: 'sidebar-layout', description: 'Product listing with filters' },
      components: []
    },
    code: `function ProductList() {
  const [search, setSearch] = React.useState('');
  
  const products = [
    { id: 1, name: 'Premium Headphones', price: '$299', stock: 'In Stock', rating: 4.8 },
    { id: 2, name: 'Ergonomic Chair', price: '$450', stock: 'In Stock', rating: 4.5 },
    { id: 3, name: 'Mechanical Keyboard', price: '$180', stock: 'Low Stock', rating: 4.9 },
    { id: 4, name: '4K Monitor', price: '$599', stock: 'Out of Stock', rating: 4.7 },
    { id: 5, name: 'USB-C Hub', price: '$45', stock: 'In Stock', rating: 4.3 },
  ];

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div data-layout="sidebar-layout" style={{ height: '100vh' }}>
      <Sidebar 
        title="Shop Admin" 
        items={[
          { label: 'Products', icon: '📦', active: true },
          { label: 'Orders', icon: '🛍️' },
          { label: 'Customers', icon: '👥' },
          { label: 'Analytics', icon: '📊' }
        ]} 
      />
      <div data-layout="flex-col" style={{ flex: 1, overflow: 'auto' }}>
        <Navbar 
          brand="Inventory" 
          actions={<Button variant="primary" icon="+">Add Product</Button>}
        />
        <div data-layout="flex-col" data-padding="lg" data-gap="lg">
          <div data-layout="flex-row" data-gap="md" style={{ justifyContent: 'space-between' }}>
            <div style={{ width: '300px' }}>
              <Input 
                placeholder="Search products..." 
                icon="🔍" 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
              />
            </div>
            <div data-layout="flex-row" data-gap="sm">
              <Button variant="outline" icon="⬇️">Export</Button>
              <Button variant="outline" icon="⚙️">Filter</Button>
            </div>
          </div>
          
          <Card variant="outlined" padding="none">
            <Table 
              columns={[
                { key: 'name', header: 'Product Name', width: '40%' },
                { key: 'price', header: 'Price', width: '15%' },
                { key: 'stock', header: 'Status', width: '20%' },
                { key: 'rating', header: 'Rating', width: '10%' },
                { key: 'action', header: '', width: '15%' }
              ]}
              data={filtered.map(p => ({
                ...p,
                stock: <span style={{ 
                  color: p.stock === 'In Stock' ? '#16a34a' : p.stock === 'Out of Stock' ? '#dc2626' : '#ea580c',
                  fontWeight: '500'
                }}>● {p.stock}</span>,
                rating: <span>⭐ {p.rating}</span>,
                action: <Button size="sm" variant="ghost">Edit</Button>
              }))}
              hoverable
            />
          </Card>
        </div>
      </div>
    </div>
  );
}`,
    explanation: "I've created a comprehensive product management interface. It features a Sidebar for navigation and a main content area with a search bar and a responsive Table. The table supports custom rendering for status indicators (colored text) and action buttons. I also included a search filter that updates the table in real-time."
  },
  {
    keywords: ['settings', 'profile', 'preferences'],
    plan: {},
    code: `function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState('account');
  const [name, setName] = React.useState('Jatan Bhatt');
  const [email, setEmail] = React.useState('jatan@example.com');
  const [notif, setNotif] = React.useState(true);

  return (
    <div data-layout="sidebar-layout" style={{ height: '100vh' }}>
      <Sidebar 
        title="Settings" 
        items={[
          { label: 'Account', active: activeTab === 'account', icon: '👤', onClick: () => setActiveTab('account') },
          { label: 'Notifications', active: activeTab === 'notif', icon: '🔔', onClick: () => setActiveTab('notif') },
          { label: 'Security', active: activeTab === 'security', icon: '🔒', onClick: () => setActiveTab('security') }
        ]} 
      />
      <div data-layout="flex-col" data-padding="lg" style={{ flex: 1, overflow: 'auto' }}>
        <h2 style={{ marginBottom: '24px' }}>
          {activeTab === 'account' ? 'Account Settings' : activeTab === 'notif' ? 'Notifications' : 'Security'}
        </h2>
        
        {activeTab === 'account' && (
          <Card title="Profile Information" subtitle="Update your account details" variant="outlined">
            <div data-layout="flex-col" data-gap="md">
              <div data-layout="grid-2" data-gap="md">
                <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} />
                <Input label="Email Address" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <Input label="Bio" placeholder="Tell us about yourself" />
              <div data-layout="flex-row" data-gap="sm" style={{ justifyContent: 'flex-end', marginTop: '16px' }}>
                <Button variant="ghost">Cancel</Button>
                <Button variant="primary">Save Changes</Button>
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'notif' && (
           <Card title="Email Preferences" variant="outlined">
             <div data-layout="flex-col" data-gap="sm">
               <div data-layout="flex-row" data-align="center" data-gap="sm">
                 <Button variant={notif ? "primary" : "outline"} size="sm" onClick={() => setNotif(!notif)}>
                   {notif ? "Enabled" : "Disabled"}
                 </Button>
                 <span>Receive weekly implementation summaries</span>
               </div>
               <div data-layout="flex-row" data-align="center" data-gap="sm">
                 <Button variant="outline" size="sm">Disabled</Button>
                 <span>Receive marketing emails</span>
               </div>
             </div>
           </Card>
        )}
      </div>
    </div>
  );
}`,
    explanation: "I've built a functional settings page with a sidebar for navigation between categories (Account, Notifications, Security). The main content area dynamically updates based on the selected tab (simulated with state). The Account section uses a Card to group profile inputs, and the Notifications section demonstrates toggles using Buttons."
  }
];

// Fallback for unrecognized prompts
const DEFAULT_MOCK = {
  plan: { layout: { type: 'flex-col' }, components: [] },
  code: `function DefaultUI() {
  return (
    <div data-layout="flex-col" data-align="center" data-padding="lg" style={{ height: '100vh', justifyContent: 'center', textAlign: 'center' }}>
      <div style={{ fontSize: '48px', marginBottom: '20px' }}>🤖</div>
      <h2 style={{ marginBottom: '10px' }}>Mock Mode Active</h2>
      <p style={{ maxWidth: '400px', marginBottom: '20px', color: '#64748b' }}>
        You are running without an OpenAI API key. I can only generate pre-defined templates in this mode.
      </p>
      <Card title="Try these prompts:" variant="outlined">
        <ul style={{ textAlign: 'left', paddingLeft: '20px', margin: '0' }}>
          <li style={{ marginBottom: '8px' }}>"Create a dashboard..."</li>
          <li style={{ marginBottom: '8px' }}>"Make a login page..."</li>
          <li style={{ marginBottom: '8px' }}>"Show me a landing page..."</li>
          <li>"Settings page..."</li>
        </ul>
      </Card>
    </div>
  );
}`,
  explanation: "Since no API key was provided, I've rendered a default 'Mock Mode' message. This UI explains the limitation and suggests valid prompts that have pre-defined mock templates available (Dashboard, Login, Landing Page, Settings)."
};

export function runMockAgent(prompt) {
  const lowerPrompt = prompt.toLowerCase();

  const match = MOCK_TEMPLATES.find(t =>
    t.keywords.some(k => lowerPrompt.includes(k))
  );

  const template = match || DEFAULT_MOCK;

  return {
    code: template.code,
    plan: template.plan,
    explanation: template.explanation,
    isMock: true
  };
}
