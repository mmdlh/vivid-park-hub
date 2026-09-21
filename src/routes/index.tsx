import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import {
  Activity,
  AlarmClock,
  Bell,
  Building2,
  CalendarDays,
  Camera,
  CarFront,
  ChevronRight,
  CircleGauge,
  CloudSun,
  Download,
  Droplets,
  Factory,
  Flame,
  Gauge,
  Leaf,
  Lightbulb,
  Map,
  Menu,
  Radio,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Thermometer,
  UserRound,
  Users,
  Video,
  Waves,
  Wind,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";

import parkImage from "@/assets/smart-park-digital-twin.jpg";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI·智慧园区综合管控数字孪生平台" },
      { name: "description", content: "智慧园区运营、能耗、安防、通行、资产、设备、环境与告警的一体化管控平台。" },
      { property: "og:title", content: "AI·智慧园区综合管控数字孪生平台" },
      { property: "og:description", content: "八大业务域实时感知、智能分析与协同调度。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SmartPark,
});

type ModuleId = "overview" | "energy" | "security" | "parking" | "asset" | "iot" | "environment" | "alerts";
type ChartKind = "trend" | "mix" | "bar" | "radar" | "donut" | "rose" | "gauge";

const modules: Array<{ id: ModuleId; label: string; short: string; icon: LucideIcon; badge?: string }> = [
  { id: "overview", label: "园区大屏总览", short: "总览", icon: Map },
  { id: "energy", label: "能耗精细化管理", short: "能耗", icon: Zap },
  { id: "security", label: "综合安防态势", short: "安防", icon: ShieldCheck, badge: "3" },
  { id: "parking", label: "通行与停车管治", short: "通行", icon: CarFront },
  { id: "asset", label: "空间资产与招商", short: "资产", icon: Building2 },
  { id: "iot", label: "设备设施与IoT", short: "设备", icon: Radio, badge: "8" },
  { id: "environment", label: "生态环境监测", short: "环境", icon: Leaf },
  { id: "alerts", label: "告警调度中心", short: "告警", icon: AlarmClock, badge: "12" },
];

const palette = {
  cyan: "#22d3ee",
  blue: "#3b82f6",
  violet: "#8b5cf6",
  green: "#34d399",
  amber: "#fbbf24",
  red: "#fb7185",
  text: "#cbd5e1",
  grid: "rgba(148,163,184,.13)",
  axis: "rgba(148,163,184,.45)",
};

const hours = ["00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00"];

function chartOption(kind: ChartKind, liveOffset = 0) {
  const common = {
    animationDuration: 900,
    color: [palette.cyan, palette.blue, palette.violet, palette.green, palette.amber],
    textStyle: { color: palette.text, fontFamily: "Rajdhani, sans-serif" },
    tooltip: { trigger: "axis", backgroundColor: "rgba(6,13,31,.94)", borderColor: palette.cyan, textStyle: { color: palette.text } },
  };
  const axes = {
    xAxis: { type: "category", data: hours, axisLine: { lineStyle: { color: palette.axis } }, axisLabel: { color: palette.text }, axisTick: { show: false } },
    yAxis: { type: "value", splitLine: { lineStyle: { color: palette.grid } }, axisLabel: { color: palette.text }, axisLine: { show: false } },
  };
  if (kind === "radar") return { ...common, tooltip: { ...common.tooltip, trigger: "item" }, radar: { radius: "66%", indicator: [{ name: "能效", max: 100 }, { name: "安防", max: 100 }, { name: "通行", max: 100 }, { name: "环境", max: 100 }, { name: "设施", max: 100 }, { name: "服务", max: 100 }], axisName: { color: palette.text }, splitArea: { areaStyle: { color: ["rgba(34,211,238,.02)", "rgba(59,130,246,.08)"] } }, splitLine: { lineStyle: { color: palette.grid } }, axisLine: { lineStyle: { color: palette.grid } } }, series: [{ type: "radar", symbolSize: 5, areaStyle: { color: "rgba(34,211,238,.2)" }, lineStyle: { width: 2 }, data: [{ value: [88, 96, 82, 91, 86, 79], name: "园区指数" }] }] };
  if (kind === "donut" || kind === "rose") return { ...common, tooltip: { ...common.tooltip, trigger: "item" }, legend: { bottom: 0, textStyle: { color: palette.text }, itemWidth: 9, itemHeight: 9 }, series: [{ type: "pie", radius: kind === "donut" ? ["48%", "70%"] : ["18%", "68%"], center: ["50%", "45%"], roseType: kind === "rose" ? "radius" : undefined, label: { color: palette.text, formatter: "{d}%" }, itemStyle: { borderColor: "#08142d", borderWidth: 3 }, data: [{ value: 38, name: "科技研发" }, { value: 27, name: "智能制造" }, { value: 21, name: "企业服务" }, { value: 14, name: "商业配套" }] }] };
  if (kind === "gauge") return { ...common, series: [{ type: "gauge", startAngle: 210, endAngle: -30, progress: { show: true, width: 12, itemStyle: { color: palette.cyan } }, axisLine: { lineStyle: { width: 12, color: [[1, "rgba(148,163,184,.15)"]] } }, axisTick: { show: false }, splitLine: { show: false }, axisLabel: { show: false }, pointer: { show: false }, detail: { valueAnimation: true, fontSize: 28, color: palette.cyan, offsetCenter: [0, "8%"], formatter: "{value}%" }, title: { color: palette.text, offsetCenter: [0, "45%"] }, data: [{ value: 86 + (liveOffset % 3), name: "健康指数" }] }] };
  if (kind === "bar") return { ...common, grid: { left: 40, right: 16, top: 22, bottom: 30 }, ...axes, xAxis: { ...axes.xAxis, data: ["研发A", "制造B", "总部C", "商业D", "孵化E", "公区"] }, series: [{ type: "bar", barWidth: 14, data: [78, 66, 54, 47, 38, 31], itemStyle: { borderRadius: [4, 4, 0, 0], color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: palette.cyan }, { offset: 1, color: "rgba(59,130,246,.15)" }]) } }] };
  const lineData = [32, 38, 35, 63, 76, 71, 88, 57].map((v, i) => v + (i === 7 ? liveOffset % 9 : 0));
  return { ...common, legend: { top: 10, right: 8, textStyle: { color: palette.text }, itemWidth: 16, itemHeight: 8 }, grid: { left: 42, right: 20, top: 58, bottom: 30 }, ...axes, series: kind === "mix" ? [{ name: "访客", type: "bar", barWidth: 14, data: [15, 18, 32, 58, 44, 67, 76, 39], itemStyle: { borderRadius: [3, 3, 0, 0], color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: palette.blue }, { offset: 1, color: "rgba(59,130,246,.08)" }]) } }, { name: "车流", type: "line", smooth: true, symbolSize: 6, data: lineData, lineStyle: { width: 3, color: palette.cyan }, areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: "rgba(34,211,238,.32)" }, { offset: 1, color: "rgba(34,211,238,0)" }]) } }] : [{ name: "本期", type: "line", smooth: true, data: lineData, symbolSize: 6, lineStyle: { width: 3, color: palette.cyan }, areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: "rgba(34,211,238,.3)" }, { offset: 1, color: "rgba(34,211,238,0)" }]) } }, { name: "上期", type: "line", smooth: true, data: [24, 29, 33, 48, 62, 58, 72, 49], symbol: "none", lineStyle: { width: 2, type: "dashed", color: palette.violet } }] };
}

function SmartPark() {
  const [active, setActive] = useState<ModuleId>("overview");
  const [now, setNow] = useState(new Date());
  const [live, setLive] = useState(true);
  const [tick, setTick] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);
  useEffect(() => {
    const timer = window.setInterval(() => { setNow(new Date()); if (live) setTick((v) => v + 1); }, 1000);
    return () => window.clearInterval(timer);
  }, [live]);
  const current = modules.find((item) => item.id === active) ?? modules[0];
  const CurrentIcon = current.icon;
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="cyber-grid fixed inset-0 pointer-events-none" />
      <header className="fixed inset-x-0 top-0 z-40 border-b border-border/70 bg-header/85 backdrop-blur-xl">
        <div className="flex h-[72px] items-center px-4 xl:px-6">
          <div className="flex min-w-0 items-center gap-3 xl:w-[330px]">
            <div className="brand-mark"><Building2 className="size-6" /></div>
            <div className="min-w-0"><div className="truncate font-display text-base font-bold text-foreground xl:text-lg">AI·智慧园区综合管控平台</div><div className="text-[10px] font-medium text-primary tracking-[.24em]">SMART PARK IOC</div></div>
          </div>
          <nav className="mx-auto hidden h-full items-stretch lg:flex">
            {modules.map((item) => { const Icon = item.icon; return <button key={item.id} onClick={() => setActive(item.id)} className={cn("nav-item", active === item.id && "nav-item-active")}><span className="relative"><Icon className="size-4" />{item.badge && <span className="nav-badge">{item.badge}</span>}</span><span>{item.short}</span></button>; })}
          </nav>
          <div className="ml-auto flex items-center justify-end gap-3 xl:w-[340px]">
            <div className="hidden items-center gap-2 sm:flex"><span className="status-dot" /><span className="text-xs text-success">系统在线</span><span className="h-4 w-px bg-border" /><span className="font-mono text-xs text-muted-foreground">{now.toLocaleTimeString("zh-CN", { hour12: false })}</span></div>
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-primary"><Bell /><span className="absolute right-1 top-1 size-2 rounded-full bg-danger" /><span className="sr-only">通知</span></Button>
            <div className="hidden size-8 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary sm:flex"><UserRound className="size-4" /></div>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileMenu((v) => !v)}>{mobileMenu ? <X /> : <Menu />}<span className="sr-only">菜单</span></Button>
          </div>
        </div>
        {mobileMenu && <div className="grid grid-cols-4 border-t border-border bg-header/95 p-2 lg:hidden">{modules.map((item) => { const Icon = item.icon; return <button key={item.id} onClick={() => { setActive(item.id); setMobileMenu(false); }} className={cn("flex flex-col items-center gap-1 rounded-md px-1 py-2 text-[11px] text-muted-foreground", active === item.id && "bg-primary/10 text-primary")}><Icon className="size-4" />{item.short}</button>; })}</div>}
      </header>
      <main className="relative z-10 mx-auto max-w-[1920px] px-3 pb-8 pt-[88px] md:px-5">
        <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div className="flex items-center gap-3"><CurrentIcon className="size-6 text-primary" /><div><h1 className="font-display text-xl font-bold md:text-2xl">{current.label}</h1><p className="text-xs text-muted-foreground">数据更新时间 {now.toLocaleTimeString("zh-CN", { hour12: false })} · 园区综合运行指数 92.6</p></div></div>
          <div className="flex flex-wrap items-center gap-2"><DateFilter /><div className="control-chip"><span className="text-xs text-muted-foreground">实时数据</span><Switch checked={live} onCheckedChange={setLive} /></div><Button variant="outline" size="sm" className="border-border bg-card/50 text-muted-foreground"><Settings2 />自定义</Button></div>
        </div>
        {active === "overview" && <Overview tick={tick} />}
        {active === "energy" && <Energy tick={tick} />}
        {active === "security" && <Security tick={tick} />}
        {active === "parking" && <Parking tick={tick} />}
        {active === "asset" && <Asset tick={tick} />}
        {active === "iot" && <Iot tick={tick} />}
        {active === "environment" && <Environment tick={tick} />}
        {active === "alerts" && <Alerts tick={tick} />}
      </main>
    </div>
  );
}

function DateFilter() { return <div className="control-chip"><CalendarDays className="size-4 text-primary" /><span className="text-xs">今日 09月21日</span><ChevronRight className="size-3 text-muted-foreground" /></div>; }
function GlassCard({ children, className, title, extra }: { children: ReactNode; className?: string; title?: string; extra?: ReactNode }) { return <section className={cn("glass-card", className)}>{title && <div className="panel-title"><div className="flex items-center gap-2"><span className="title-mark" />{title}</div>{extra}</div>}{children}</section>; }
function Chart({ kind, tick = 0, className }: { kind: ChartKind; tick?: number; className?: string }) { const option = useMemo(() => chartOption(kind, tick), [kind, tick]); return <ReactECharts option={option} notMerge className={cn("h-[220px] w-full", className)} />; }
function Kpi({ icon: Icon, label, value, unit, trend, tone = "cyan" }: { icon: LucideIcon; label: string; value: string; unit?: string; trend?: string; tone?: string }) { return <GlassCard className="kpi-card"><div className={cn("kpi-icon", `tone-${tone}`)}><Icon className="size-5" /></div><div className="min-w-0"><p className="truncate text-xs text-muted-foreground">{label}</p><p className="mt-1 font-display text-2xl font-bold text-foreground">{value}<span className="ml-1 text-xs font-normal text-muted-foreground">{unit}</span></p>{trend && <p className="mt-1 text-[11px] text-success">↗ {trend}</p>}</div></GlassCard>; }
function SectionGrid({ children }: { children: ReactNode }) { return <div className="grid gap-4 xl:grid-cols-12">{children}</div>; }
function Status({ children, tone = "success" }: { children: ReactNode; tone?: "success" | "warning" | "danger" | "info" }) { return <span className={cn("status-tag", `status-${tone}`)}><span className="size-1.5 rounded-full bg-current" />{children}</span>; }

function Overview({ tick }: { tick: number }) {
  return <div className="space-y-4">
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><Kpi icon={Building2} label="入驻企业" value="286" unit="家" trend="较上月 +12" /><Kpi icon={Users} label="今日园区人数" value={String(8624 + tick % 18)} unit="人" trend="实时客流 +3.2%" tone="blue" /><Kpi icon={CircleGauge} label="综合运营指数" value="92.6" unit="分" trend="全市第 2 名" tone="violet" /><Kpi icon={AlarmClock} label="待处置事件" value="12" unit="项" trend="已处置 96.8%" tone="amber" /></div>
    <SectionGrid>
      <GlassCard className="relative min-h-[470px] overflow-hidden xl:col-span-7"><img src={parkImage} alt="智慧园区数字孪生鸟瞰图" width={1920} height={1088} className="absolute inset-0 h-full w-full object-cover opacity-80" /><div className="absolute inset-0 bg-map-shade" /><div className="absolute left-5 top-5"><p className="text-xs text-primary">DIGITAL TWIN · LIVE</p><h2 className="mt-1 font-display text-xl font-bold">滨江智造科技园</h2></div><MapPin label="A1 研发中心" status="98%" className="left-[24%] top-[44%]" /><MapPin label="B2 智造中心" status="96%" className="left-[61%] top-[30%]" /><MapPin label="C1 企业总部" status="91%" className="left-[47%] top-[59%]" /><div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2"><MapStat label="设备接入" value="12,680" /><MapStat label="建筑面积" value="86.4万㎡" /><MapStat label="实时事件" value="36" /></div></GlassCard>
      <div className="space-y-4 xl:col-span-5"><GlassCard title="园区多维运营指数"><Chart kind="radar" className="h-[250px]" /></GlassCard><GlassCard title="实时事件播报" extra={<Status tone="danger">3 紧急</Status>}><TickerRows /></GlassCard></div>
      <GlassCard title="24小时人车流量" className="xl:col-span-8"><Chart kind="mix" tick={tick} /></GlassCard><GlassCard title="入驻企业业态分布" className="xl:col-span-4"><Chart kind="donut" /></GlassCard>
    </SectionGrid>
  </div>;
}
function MapPin({ label, status, className }: { label: string; status: string; className?: string }) { return <div className={cn("map-pin", className)}><span className="map-pulse" /><div><b>{label}</b><small>运行率 {status}</small></div></div>; }
function MapStat({ label, value }: { label: string; value: string }) { return <div className="map-stat"><span>{label}</span><b>{value}</b></div>; }
function TickerRows() { return <div className="space-y-2">{[["08:48", "A3栋烟感设备离线", "warning"], ["08:42", "北门访客通道拥堵", "info"], ["08:31", "B2配电柜温度偏高", "danger"]].map(([time, text, tone]) => <div key={text} className="event-row"><span className="font-mono text-[11px] text-primary">{time}</span><span className="flex-1 text-xs">{text}</span><Status tone={tone as "warning" | "info" | "danger"}>处理中</Status></div>)}</div>; }

function Energy({ tick }: { tick: number }) { return <div className="space-y-4"><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5"><Kpi icon={Zap} label="今日用电" value="86,420" unit="kWh" trend="同比 -6.2%" /><Kpi icon={Droplets} label="今日用水" value="1,286" unit="m³" trend="同比 -3.8%" tone="blue" /><Kpi icon={Flame} label="今日用气" value="3,952" unit="m³" trend="同比 -1.6%" tone="violet" /><Kpi icon={Leaf} label="碳排放量" value="38.6" unit="tCO₂" trend="目标内 12%" tone="green" /><Kpi icon={Gauge} label="综合能效" value="91.4" unit="分" trend="优秀" tone="amber" /></div><SectionGrid><GlassCard title="综合能耗趋势" className="xl:col-span-7"><Chart kind="trend" tick={tick} className="h-[280px]" /></GlassCard><GlassCard title="峰谷能效健康度" className="xl:col-span-5"><Chart kind="gauge" tick={tick} className="h-[280px]" /></GlassCard><GlassCard title="各部门能耗成本对比" className="xl:col-span-7"><Chart kind="bar" /></GlassCard><GlassCard title="AI 节能建议" extra={<span className="text-xs text-primary">预计节省 ¥24,800/月</span>} className="xl:col-span-5"><AdviceList /></GlassCard></SectionGrid></div>; }
function AdviceList() { return <div className="space-y-3 pt-2">{[["空调群控优化", "A1/A2楼晚间负荷偏高，建议提前30分钟进入节能模式", "高"], ["照明策略调整", "地下车库B区照度高于标准18%，建议联动人体感应", "中"], ["需量峰值预警", "预计14:30达到本月需量峰值，建议错峰启动冷机", "高"]].map(([title, desc, level]) => <div className="advice-row" key={title}><div className="advice-icon"><Sparkles className="size-4" /></div><div className="min-w-0 flex-1"><div className="flex justify-between"><b className="text-sm">{title}</b><span className="text-xs text-warning">{level}优先级</span></div><p className="mt-1 text-xs leading-5 text-muted-foreground">{desc}</p></div></div>)}</div>; }

function Security({ tick }: { tick: number }) { return <div className="space-y-4"><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><Kpi icon={Camera} label="视频监控在线" value="1,284" unit="/ 1,296" trend="在线率 99.1%" /><Kpi icon={ShieldCheck} label="今日AI识别事件" value="138" unit="次" trend="准确率 97.8%" tone="blue" /><Kpi icon={Users} label="在岗安保人员" value="86" unit="人" trend="巡更完成 92%" tone="green" /><Kpi icon={AlarmClock} label="未闭环告警" value="3" unit="条" trend="最长 12分钟" tone="amber" /></div><SectionGrid><GlassCard title="实时视频巡检" extra={<Button variant="ghost" size="sm"><Video />轮巡模式</Button>} className="xl:col-span-8"><CameraGrid /></GlassCard><div className="space-y-4 xl:col-span-4"><GlassCard title="安全态势指数"><Chart kind="radar" /></GlassCard><GlassCard title="设备在线率"><div className="grid grid-cols-2 gap-3 py-3"><Ring value="99.1" label="监控" /><Ring value="97.6" label="门禁" /></div></GlassCard></div><GlassCard title="AI告警记录" className="xl:col-span-8"><DataTable type="security" /></GlassCard><GlassCard title="安保巡更路线" className="xl:col-span-4"><Patrol /></GlassCard></SectionGrid></div>; }
function CameraGrid() { return <div className="grid grid-cols-2 gap-2 pt-2 md:grid-cols-3">{["东门访客通道", "A1大堂", "北区停车场", "B2生产通道", "中心广场", "地下车库B区"].map((name, i) => <div key={name} className="camera-feed"><img src={parkImage} alt="模拟监控画面" width={1920} height={1088} loading="lazy" className={cn("h-full w-full object-cover", i % 2 ? "object-right" : "object-left")} /><div className="camera-scan" /><span className="camera-live"><span className="status-dot" />LIVE</span><span className="camera-name">CAM {String(i + 1).padStart(2, "0")} · {name}</span></div>)}</div>; }
function Ring({ value, label }: { value: string; label: string }) { return <div className="ring-meter" style={{ "--value": `${value}%` } as React.CSSProperties}><div><b>{value}%</b><small>{label}</small></div></div>; }
function Patrol() { return <div className="space-y-4 pt-2">{["北区 01线", "核心区 02线", "南区 03线"].map((name, i) => <div key={name}><div className="mb-2 flex justify-between text-xs"><span>{name}</span><span className="text-primary">{[92, 76, 64][i]}%</span></div><div className="progress-track"><div className="progress-fill" style={{ width: `${[92, 76, 64][i]}%` }} /></div></div>)}</div>; }

function Parking({ tick }: { tick: number }) { return <div className="space-y-4"><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><Kpi icon={CarFront} label="总车位" value="3,286" unit="个" trend="6个停车区" /><Kpi icon={Gauge} label="剩余车位" value="864" unit="个" trend="空闲率 26.3%" tone="green" /><Kpi icon={Activity} label="今日车流" value="8,624" unit="辆" trend="较昨日 +5.2%" tone="blue" /><Kpi icon={Users} label="访客预约" value="486" unit="人" trend="通过率 98.6%" tone="violet" /></div><SectionGrid><GlassCard title="停车资源实时态势" extra={<Status>数据实时</Status>} className="xl:col-span-7"><ParkingMap /></GlassCard><GlassCard title="车位利用率" className="xl:col-span-5"><Chart kind="gauge" tick={tick} className="h-[300px]" /></GlassCard><GlassCard title="进出车辆高峰流量" className="xl:col-span-8"><Chart kind="mix" tick={tick} /></GlassCard><GlassCard title="访客授权通过率" className="xl:col-span-4"><Chart kind="bar" /></GlassCard><GlassCard title="车牌识别记录" className="xl:col-span-12"><DataTable type="parking" /></GlassCard></SectionGrid></div>; }
function ParkingMap() { const occupied = [1,2,4,5,8,11,12,15,16,17,21,22,24,26,27,30,31,34,36,39]; return <div className="parking-map"><div className="mb-4 flex gap-4 text-xs"><span><i className="legend-box bg-success" />空闲 864</span><span><i className="legend-box bg-primary" />占用 2,398</span><span><i className="legend-box bg-danger" />异常 24</span></div><div className="grid grid-cols-8 gap-2 sm:grid-cols-10">{Array.from({ length: 40 }, (_, i) => <div key={i} className={cn("parking-bay", occupied.includes(i) && "bay-used", i === 14 && "bay-alert")}>{occupied.includes(i) ? <CarFront className="size-4" /> : <span>{i + 1}</span>}</div>)}</div><div className="mt-4 grid grid-cols-3 gap-2">{[["A区", "82%"], ["B区", "76%"], ["C区", "68%"]].map(([a,b]) => <div key={a} className="map-stat"><span>{a}占用</span><b>{b}</b></div>)}</div></div>; }

function Asset({ tick }: { tick: number }) { return <div className="space-y-4"><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><Kpi icon={Building2} label="可租赁面积" value="42,680" unit="㎡" trend="环比 -8.2%" /><Kpi icon={Gauge} label="整体出租率" value="91.6" unit="%" trend="目标达成 102%" tone="green" /><Kpi icon={Factory} label="本月租赁收入" value="2,864" unit="万元" trend="同比 +12.8%" tone="blue" /><Kpi icon={AlarmClock} label="90天内到期" value="18" unit="份" trend="涉及 12 家企业" tone="amber" /></div><SectionGrid><GlassCard title="楼宇空间全景" extra={<div className="flex gap-2 text-[11px]"><Status>已租</Status><Status tone="warning">空置</Status></div>} className="xl:col-span-7"><FloorStack /></GlassCard><GlassCard title="产业业态结构" className="xl:col-span-5"><Chart kind="rose" className="h-[330px]" /></GlassCard><GlassCard title="租赁收入趋势" className="xl:col-span-7"><Chart kind="trend" tick={tick} /></GlassCard><GlassCard title="优质可租空间" className="xl:col-span-5"><SpaceCards /></GlassCard><GlassCard title="租约到期预警" className="xl:col-span-12"><DataTable type="asset" /></GlassCard></SectionGrid></div>; }
function FloorStack() { return <div className="floor-wrap">{["12F", "11F", "10F", "9F", "8F", "7F"].map((floor, i) => <div className="floor-row" key={floor}><b>{floor}</b>{Array.from({length: 8}, (_, j) => <span key={j} className={cn((j + i) % 5 === 0 && "space-free")}>{(j + i) % 5 === 0 ? "可租" : "已租"}</span>)}<em>{[94,88,92,81,96,86][i]}%</em></div>)}</div>; }
function SpaceCards() { return <div className="grid gap-2 pt-2 sm:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">{[["A1·1206", "268㎡", "精装"], ["B2·0812", "526㎡", "研发"], ["C1·0603", "186㎡", "总部"]].map(([name, area, tag]) => <div className="space-card" key={name}><Building2 className="size-5 text-primary" /><b>{name}</b><strong>{area}</strong><span>{tag} · 即租即用</span></div>)}</div>; }

function Iot({ tick }: { tick: number }) { const devices = [[Wind,"暖通空调","1,286","98.2%"],[Building2,"智慧电梯","108","99.1%"],[Lightbulb,"智慧照明","8,620","97.6%"],[Waves,"给排水泵","326","96.8%"]] as const; return <div className="space-y-4"><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{devices.map(([icon,label,value,trend],i) => <Kpi key={label} icon={icon} label={label} value={value} unit="台" trend={`在线率 ${trend}`} tone={["cyan","blue","violet","green"][i]} />)}</div><SectionGrid><GlassCard title="设备健康总指数" className="xl:col-span-4"><Chart kind="gauge" tick={tick} className="h-[300px]" /></GlassCard><GlassCard title="设备故障频次分析" className="xl:col-span-8"><Chart kind="bar" className="h-[300px]" /></GlassCard><GlassCard title="关键设备实时遥测" className="xl:col-span-5"><Telemetry /></GlassCard><GlassCard title="维保工单调度" extra={<Button size="sm">新建工单</Button>} className="xl:col-span-7"><DataTable type="iot" /></GlassCard></SectionGrid></div>; }
function Telemetry() { return <div className="grid grid-cols-2 gap-3 pt-2">{[["冷机出水温度","7.2°C",Thermometer],["电梯振动值","0.18mm/s",Activity],["水泵压力","0.42MPa",Gauge],["照明回路电流","12.8A",Zap]].map(([name,value,Icon]) => { const I = Icon as LucideIcon; return <div className="telemetry" key={String(name)}><I className="size-5 text-primary" /><span>{name}</span><b>{value}</b><small><span className="status-dot" />运行正常</small></div>; })}</div>; }

function Environment({ tick }: { tick: number }) { return <div className="space-y-4"><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"><Kpi icon={Wind} label="PM2.5" value="18" unit="μg/m³" trend="优" tone="green" /><Kpi icon={Waves} label="PM10" value="36" unit="μg/m³" trend="优" /><Kpi icon={Thermometer} label="环境温度" value="25.6" unit="°C" trend="舒适" tone="amber" /><Kpi icon={Droplets} label="相对湿度" value="58" unit="%" trend="舒适" tone="blue" /><Kpi icon={Activity} label="环境噪声" value="46" unit="dB" trend="安静" tone="violet" /><Kpi icon={Leaf} label="碳汇指数" value="86.2" unit="分" trend="优秀" tone="green" /></div><SectionGrid><GlassCard title="24小时空气质量变化" className="xl:col-span-8"><Chart kind="trend" tick={tick} className="h-[290px]" /></GlassCard><GlassCard title="未来四日天气" className="xl:col-span-4"><Weather /></GlassCard><GlassCard title="环境指标综合评估" className="xl:col-span-5"><Chart kind="radar" /></GlassCard><GlassCard title="园区低碳目标" className="xl:col-span-7"><CarbonGoals /></GlassCard></SectionGrid></div>; }
function Weather() { return <div className="grid grid-cols-4 gap-2 pt-4">{[["今天","28°",CloudSun],["周二","26°",CloudSun],["周三","24°",Droplets],["周四","27°",Wind]].map(([day,temp,Icon],i) => { const I = Icon as LucideIcon; return <div className={cn("weather-card", i===0 && "weather-active")} key={String(day)}><span>{day}</span><I className="my-4 size-7" /><b>{temp}</b><small>{i===2 ? "小雨" : "多云"}</small></div>; })}</div>; }
function CarbonGoals() { return <div className="space-y-5 pt-5">{[["年度单位产值能耗下降","72","目标 8.0% · 当前 5.8%"],["可再生能源使用占比","86","目标 30% · 当前 25.8%"],["园区碳汇能力提升","64","目标 1,200t · 当前 768t"]].map(([name,value,desc]) => <div key={name}><div className="mb-2 flex justify-between"><div><b className="text-sm">{name}</b><p className="text-xs text-muted-foreground">{desc}</p></div><strong className="text-primary">{value}%</strong></div><div className="progress-track"><div className="progress-fill" style={{width:`${value}%`}} /></div></div>)}</div>; }

function Alerts({ tick }: { tick: number }) { const [query, setQuery] = useState(""); return <div className="space-y-4"><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><Kpi icon={AlarmClock} label="今日告警总量" value={String(126 + tick % 4)} unit="条" trend="同比 -8.4%" /><Kpi icon={Flame} label="紧急告警" value="3" unit="条" trend="全部响应" tone="amber" /><Kpi icon={ShieldCheck} label="闭环率" value="96.8" unit="%" trend="目标 95%" tone="green" /><Kpi icon={Activity} label="平均处置时长" value="8.6" unit="分钟" trend="缩短 2.3 分钟" tone="blue" /></div><SectionGrid><GlassCard title="应急事件调度矩阵" className="xl:col-span-8"><Kanban /></GlassCard><GlassCard title="告警等级分布" className="xl:col-span-4"><Chart kind="donut" /></GlassCard><GlassCard title="平均处置时长趋势" className="xl:col-span-5"><Chart kind="trend" tick={tick} /></GlassCard><GlassCard title="历史事件稽核" extra={<div className="flex gap-2"><div className="relative hidden sm:block"><Search className="absolute left-2 top-2 size-4 text-muted-foreground" /><Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索事件" className="h-8 w-40 pl-8" /></div><Button variant="outline" size="sm"><Download />导出</Button></div>} className="xl:col-span-7"><DataTable type="alert" query={query} /></GlassCard></SectionGrid></div>; }
function Kanban() { return <div className="grid gap-3 pt-2 sm:grid-cols-2 lg:grid-cols-4">{[["待研判","3","danger"],["调度中","8","warning"],["处置中","12","info"],["已闭环","103","success"]].map(([name,count,tone],i) => <div className="kanban-col" key={name}><div className="mb-3 flex items-center justify-between"><b>{name}</b><span className="font-display text-xl text-primary">{count}</span></div>{Array.from({length:i===3?2:3},(_,j)=><EventCard key={j} index={i*3+j} tone={tone as "danger"|"warning"|"info"|"success"} />)}</div>)}</div>; }
function EventCard({ index, tone }: { index: number; tone: "danger"|"warning"|"info"|"success" }) { const names=["配电房温度异常","北门人流密度过高","消防通道占用","电梯困人告警","水浸传感器触发","园区围界入侵"]; return <div className="event-card"><div className="flex justify-between"><Status tone={tone}>{tone === "danger" ? "紧急" : tone === "warning" ? "重要" : tone === "success" ? "已完成" : "一般"}</Status><span className="text-[10px] text-muted-foreground">08:{42-index}</span></div><b>{names[index%names.length]}</b><small>A{index%3+1}栋 · 自动上报</small></div>; }

const tableData = {
  security: [["08:48:26","A3栋东侧","烟雾识别","紧急","处理中"],["08:41:12","北门通道","人员聚集","重要","已派单"],["08:26:44","B2仓储区","越界入侵","一般","已闭环"]],
  parking: [["浙A·6R28Q","东门入口","访客车辆","08:52:16","已入园"],["浙A·93K7M","地下B出口","内部车辆","08:49:03","已离园"],["沪B·1Q88F","北门入口","预约访客","08:46:25","已入园"]],
  asset: [["智云科技","A1-1201","2026-11-18","68天","续租洽谈"],["微光智能","B2-0803","2026-10-26","35天","待跟进"],["星航制造","C1-0602","2026-10-12","21天","已续签"]],
  iot: [["WO-260921-086","B2电梯异响","电梯系统","李工","处理中"],["WO-260921-079","A1空调温差","暖通系统","王工","待接单"],["WO-260920-168","C区照明故障","照明系统","陈工","已完成"]],
  alert: [["AL-260921-126","消防通道占用","安防","8分钟","已闭环"],["AL-260921-125","配电柜温升","设备","12分钟","已闭环"],["AL-260921-119","访客通道拥堵","通行","6分钟","已闭环"]],
};
const tableHeads = { security:["时间","位置","事件类型","等级","状态"], parking:["车牌号码","通道","车辆类型","识别时间","状态"], asset:["企业","房源","到期日期","剩余","进展"], iot:["工单编号","故障内容","系统","负责人","状态"], alert:["事件编号","事件名称","来源","处置时长","结果"] };
function DataTable({ type, query="" }: { type: keyof typeof tableData; query?: string }) { const [detail, setDetail] = useState<string[] | null>(null); const rows=tableData[type].filter(row=>row.join("").includes(query)); return <><div className="overflow-x-auto"><table className="data-table"><thead><tr>{tableHeads[type].map(h=><th key={h}>{h}</th>)}<th>操作</th></tr></thead><tbody>{rows.map((row,i)=><tr key={row[0]}>{row.map((cell,j)=><td key={cell}>{j===row.length-1?<Status tone={cell.includes("已")?"success":cell.includes("处理")?"warning":"info"}>{cell}</Status>:cell}</td>)}<td><Button variant="ghost" size="sm" onClick={()=>setDetail(row)}>详情</Button></td></tr>)}</tbody></table></div><Dialog open={Boolean(detail)} onOpenChange={(open)=>!open&&setDetail(null)}><DialogContent className="border-border bg-card text-foreground"><DialogHeader><DialogTitle>记录详情</DialogTitle><DialogDescription>事件全链路信息与最新处置进展</DialogDescription></DialogHeader><div className="detail-grid">{detail?.map((value,i)=><div key={value}><span>{tableHeads[type][i]}</span><b>{value}</b></div>)}</div><div className="event-row"><Status>系统已核验</Status><span className="text-xs text-muted-foreground">数据已同步至园区运营中心</span></div></DialogContent></Dialog></>; }