# Smart Park Nexus

Implement the smart park management platform now; use internal planning and do not present another implementation plan for user approval.

User request:
"做一个智慧园区管理平台，8个一级菜单，要求：
- 深色科技风背景，浅蓝/深蓝为主色调，带智慧园区风格背景图
- 毛玻璃半透明卡片，带流光渐变边框和hover浮起效果
- 顶部固定导航栏，左侧大标题+右侧图标菜单，导航栏也要有玻璃质感
- 每个页面布局要有明显差异，内容要特别丰富：统计数据卡片 + 多种echarts图表（折线、柱状、雷达、饼图混排）+ 数据表格 + 状态指示器
- 数据要有立体感和色彩冲击力，整体炫酷、现代、有科技感"

Detailed requirements and scope:
1. Top Navigation:
   - Fixed header with high-tech frosted glass blur backdrop (`backdrop-blur-md bg-[#0a1128]/80 border-b border-cyan-500/20`).
   - Left side: bold futuristic title (e.g., "AI·智慧园区综合管控数字孪生平台" / "SMART PARK IOC") with live status pill (online, alarm counter, real-time clock).
   - Right side: 8 primary menu navigation items with icons, active state glowing neon accent, notification badges, and user profile avatar.

2. Eight First-Level Modules (distinct layouts & rich visualizations):
   - 园区大屏总览 (Park Cockpit): Digital twin map/isometric 3D park graphic backdrop, KPI summary cards with glow borders, real-time alert ticker, multi-metric radar chart, hourly traffic/visitor line-bar mixed chart, tenant distribution donut chart.
   - 能耗精细化管理 (Energy Monitoring): Total power/water/gas usage metrics, carbon emissions tracker, energy consumption trend line chart, department energy cost comparison horizontal bar chart, peak/valley usage gauge charts, energy-saving advice list.
   - 综合安防态势 (Security & Surveillance): Real-time CCTV simulation camera feed grid with PTZ controls, security personnel patrol route tracker, AI intrusion/fire alert log table, security level radar chart, device online rate donut chart.
   - 通行与停车管治 (Access & Smart Parking): Parking lot occupancy heatmap/visual bay display, inbound/outbound vehicle peak flow area chart, visitor authorization pass rate bar chart, plate recognition history log table with vehicle thumbnail badges.
   - 空间资产与招商 (Space & Asset Management): Building floor visual occupancy layout, leasing revenue trend chart, industry category breakdown pie/rose chart, lease expiration warning table, available office space filtering cards.
   - 设备设施与IoT (IoT Facility & Maintenance): Device telemetry status metrics (HVAC, elevators, smart lighting, pumps), health index gauges, failure frequency bar chart, maintenance dispatch work order table with status tags.
   - 生态环境监测 (Environment Quality): PM2.5, PM10, temperature, humidity, noise gauges, 24-hour air quality index dual-axis line chart, weather forecast cards, carbon sink index progress bars.
   - 告警调度中心 (Alert Center & Dispatch): Emergency alert triage kanban / matrix, severity-level distribution pie chart, mean-time-to-resolution (MTTR) trend line chart, historical incident inspection data table with filtering, search, and export actions.

3. Visual & Chart Quality Rules:
   - Tech aesthetic: Dark deep-space navy/cyan/neon-blue palette (`#060d1f`, `#0b193d`, `#00f0ff`, `#3b82f6`, `#8b5cf6`), cyber grid and radial gradient lighting.
   - Cards: Glassmorphic cards with translucent backdrop blur, cyan/blue gradient borders (`border border-cyan-500/30 shadow-[0_0_15px_rgba(0,240,255,0.15)]`), glowing hover lift-up transitions.
   - ECharts integration:
     * Clean, responsive Apache ECharts integration with dark tech themes, smooth tooltip animations, and gradient area fills.
     * Chart legends on line charts and mixed line/bar charts MUST be positioned at the top (`legend: { top: 10, ... }`) with generous `grid.top` (e.g. 50-60px) to ensure no overlap between legends and data lines/bars.
     * When composing or updating chart options, ensure custom override values come last in object spreads.
   - Rich interactive features: Date range pickers, active tabs, filter dropdowns, search inputs, modal detail view for alarms and work orders, simulated live-data tick update toggle.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://vivid-park-hub.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b8cf5867-74c8-45e5-8c9c-cd81acc831fd).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
