import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useSelector } from 'react-redux'
import { useChat } from "../hooks/useChat"
import remarkGfm from 'remark-gfm'
import '../chat.css'


const Dashboard = () => {
  const chat = useChat()
  const [activeNav, setActiveNav] = useState('Search')
  const [activeChat, setActiveChat] = useState(0)
  const [chatInput, setChatInput] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const chats = useSelector((state) => state.chat.chats)
  const currentChatId = useSelector((state) => state.chat.currentChatId)

  useEffect(() => {
    chat.initializeSocketConnection()
    chat.handleGetChats()
  }, [])

  const handleSubmitMessage = (event) => {
    event.preventDefault()
    const trimmedMessage = chatInput.trim()
    if (!trimmedMessage) return
    chat.handleSendMessage({ message: trimmedMessage, chatId: currentChatId })
    setChatInput('')
  }

  const openChat = (chatId) => {
    chat.handleOpenChat(chatId, chats)
  }

  const hasActiveChat = currentChatId && chats[currentChatId]?.messages?.length > 0
  const categories = ['Trending Tech', 'Startups']

  const categoryIcons = {
    'Trending Tech': (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    'Startups': (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  }

  return (
    <>
      <div
        className="fixed inset-0 flex overflow-hidden"
        style={{ fontFamily: "'Sora', sans-serif", background: '#09090f' }}
      >

        {/* ── Animated background ── */}
        <div className="bg-noise fixed inset-0 z-0 overflow-hidden pointer-events-none"
          style={{ background: 'linear-gradient(160deg, #0d0d1f 0%, #0a0918 40%, #0c0820 70%, #080810 100%)' }}
        >
          <div className="blob-1 absolute rounded-full pointer-events-none"
            style={{ width: 600, height: 600, top: '-15%', left: '-10%', filter: 'blur(80px)', willChange: 'transform', background: 'radial-gradient(circle, rgba(91,120,246,0.6) 0%, transparent 70%)' }}
          />
          <div className="blob-2 absolute rounded-full pointer-events-none"
            style={{ width: 500, height: 500, bottom: '-10%', right: '5%', filter: 'blur(80px)', willChange: 'transform', background: 'radial-gradient(circle, rgba(140,60,220,0.55) 0%, transparent 70%)' }}
          />
          <div className="blob-3 absolute rounded-full pointer-events-none"
            style={{ width: 380, height: 380, top: '30%', left: '35%', filter: 'blur(80px)', willChange: 'transform', background: 'radial-gradient(circle, rgba(50,130,255,0.4) 0%, transparent 70%)' }}
          />
          <div className="blob-4 absolute rounded-full pointer-events-none"
            style={{ width: 320, height: 320, top: '10%', right: '15%', filter: 'blur(80px)', willChange: 'transform', background: 'radial-gradient(circle, rgba(100,60,200,0.35) 0%, transparent 70%)' }}
          />
          <div className="blob-5 absolute rounded-full pointer-events-none"
            style={{ width: 260, height: 260, bottom: '20%', left: '20%', filter: 'blur(80px)', willChange: 'transform', background: 'radial-gradient(circle, rgba(60,160,255,0.3) 0%, transparent 70%)' }}
          />
        </div>

        {/* ── Sidebar ── */}
        <aside
          className={`glass relative z-10 flex flex-col shrink-0 overflow-hidden rounded-2xl ml-1.5 mt-1.5 p-4 ${!sidebarOpen ? 'sidebar-collapsed' : ''}`}
          style={{
            width: sidebarOpen ? 220 : 56,
            minWidth: sidebarOpen ? 220 : 56,
            maxWidth: sidebarOpen ? 220 : 56,
            transition: 'width 0.25s ease, min-width 0.25s ease, max-width 0.25s ease, background 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
            height: 'calc(100vh - 24px)', maxHeight: 'calc(100vh - 24px)',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 40px rgba(0,0,0,0.5)',
          }}
        >
          {/* Logo row */}
          <div className="flex items-center gap-2 px-1 mb-7">
            <button
              onClick={() => setSidebarOpen(prev => !prev)}
              className="w-7 h-7 flex items-center justify-center rounded-lg shrink-0"
              style={{
                background: 'linear-gradient(135deg, #5b8cf7, #7c5ce8)',
                boxShadow: '0 0 14px rgba(100,100,240,0.5)',
                border: 'none',
                cursor: 'pointer',
                transition: 'opacity 0.2s ease',
              }}
              aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h320v-560H200v560Zm560 0v-560H600v560h160Z" />
              </svg>
            </button>

            <span className="sidebar-title text-sm font-semibold tracking-tight" style={{ color: 'rgba(255,255,255,0.92)' }}>
              Veltrix
            </span>
          </div>

          {/* Nav items */}
          <div className="sidebar-content">
            {[
              { label: 'Search', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg> },
              { label: 'Chats', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg> },
              { label: 'Insta Post', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg> },
            ].map(({ label, icon }) => (
              <button
                key={label}
                className="flex items-center gap-2.5 w-full text-left px-2.5 py-2 rounded-xl text-xs font-medium mb-0.5 transition-all duration-200"
                style={{
                  color: activeNav === label ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.45)',
                  background: activeNav === label ? 'rgba(255,255,255,0.08)' : 'transparent',
                }}
                onClick={() => setActiveNav(label)}
              >
                {icon}{label}
              </button>
            ))}
          </div>

          {/* New Chat */}
          <button
            className="nav-btn new-chat-btn flex items-center gap-2.5 w-full text-left px-2.5 py-2 rounded-xl text-xs font-medium mt-1 transition-all duration-200"
            style={{ color: 'rgba(255,255,255,0.55)', background: 'transparent' }}
            onClick={() => chat.handleGetChats && chat.handleGetChats()}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            New Chat
          </button>

          {/* Recent label + chat list */}
          <div className="sidebar-content flex flex-col flex-1 min-h-0">
            <p className="text-xs font-semibold uppercase tracking-widest px-2.5 mt-4 mb-1.5" style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10 }}>
              Recent
            </p>
            <nav className="hide-scrollbar flex-1 flex flex-col gap-px overflow-y-auto">
              {Object.values(chats).length === 0 ? (
                <p className="px-2.5 py-1 text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>No recent chats</p>
              ) : (
                Object.values(chats).map((c, index) => (
                  <button
                    key={index}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs truncate transition-all duration-200"
                    style={{
                      color: activeChat === c.id ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.4)',
                      background: activeChat === c.id ? 'linear-gradient(135deg, rgba(91,140,247,0.2), rgba(124,92,232,0.15))' : 'transparent',
                      border: activeChat === c.id ? '1px solid rgba(124,92,232,0.25)' : '1px solid transparent',
                      fontWeight: activeChat === c.id ? 500 : 400,
                    }}
                    onClick={() => { setActiveChat(c.id); openChat(c.id) }}
                  >
                    {c.title}
                  </button>
                ))
              )}
            </nav>
          </div>

          {/* Footer */}
          <div className="sidebar-footer mt-3 pt-3 flex flex-col gap-1.5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <button
              className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg text-xs transition-colors duration-200"
              style={{ color: 'rgba(255,255,255,0.35)', background: 'transparent', border: 'none' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
              Light Mode
            </button>
            <div className="flex items-center gap-2 px-2.5 py-1.5">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold text-white"
                style={{ background: 'linear-gradient(135deg, #5b8cf7, #7c5ce8)' }}
              >J</div>
              <span className="flex-1 text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>jammy</span>
            </div>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="relative z-10 flex flex-col flex-1 overflow-hidden min-w-0 p-3 pl-2">

          {!hasActiveChat ? (
            <div className="flex flex-col flex-1 items-center justify-center pb-20">

              <div className="fade-up flex items-center mb-8">
                <div
                  className="w-28 h-28 flex items-center justify-center rounded-2xl"
                // style={{ background: 'linear-gradient(135deg, #5b8cf7, #7c5ce8)', boxShadow: '0 0 28px rgba(100,100,240,0.45), inset 0 1px 0 rgba(255,255,255,0.2)' }}
                >
                  {/* <svg xmlns="http://www.w3.org/2000/svg" width="2024" height="2024" viewBox="0 0 1024 1024">
                    <g>
                      <path d="M 428.00 521.39 C434.88,525.56 440.84,528.98 ..." fill="rgb(0,0,0)" />
                      <path d="M 505.25 849.59 L 499.00 840.25 L 499.00 798.17 L 499.00 756.08 L 483.75 743.37 C470.24,732.10 441.82,704.79 433.33,694.91 L 430.24 691.32 L 438.92 689.78 C443.69,688.94 450.45,687.09 453.94,685.68 L 460.29 683.12 L 471.39 693.51 C484.66,705.91 498.61,717.25 504.01,720.00 C508.93,722.52 515.00,722.55 519.79,720.10 C529.07,715.34 562.84,682.95 569.88,672.07 C572.05,668.70 574.87,663.15 576.15,659.72 L 578.46 653.50 L 578.77 564.68 C578.94,515.83 579.42,476.00 579.83,476.18 C580.25,476.36 587.88,480.94 596.79,486.36 L 613.00 496.22 L 612.97 573.36 C612.93,655.34 612.76,658.77 608.05,671.21 C601.58,688.30 576.69,714.76 536.75,747.01 L 525.01 756.50 L 525.00 798.68 L 525.00 840.87 L 518.75 849.92 C515.31,854.90 512.28,858.97 512.00,858.95 C511.73,858.94 508.69,854.73 505.25,849.59 ZM 285.00 665.45 C285.00,613.50 285.34,571.01 285.75,571.03 C286.16,571.05 287.98,572.40 289.79,574.05 C292.50,576.52 293.49,578.67 295.44,586.35 C297.84,595.84 302.00,605.20 307.13,612.68 L 310.00 616.86 L 310.00 665.28 L 310.00 713.69 L 345.75 692.35 C365.41,680.61 381.76,671.01 382.07,671.00 C383.73,670.99 407.05,686.33 406.34,686.96 C405.55,687.66 339.66,727.33 302.25,749.62 L 285.00 759.90 L 285.00 665.45 ZM 701.50 737.19 C681.70,725.26 654.38,708.79 640.79,700.59 C627.20,692.40 616.26,685.38 616.50,685.01 C617.36,683.60 640.90,669.82 641.69,670.26 C642.13,670.51 658.06,680.00 677.08,691.36 C696.10,702.71 712.18,712.00 712.83,712.00 C713.71,712.00 714.00,700.28 714.00,665.01 L 714.00 618.02 L 719.02 609.27 C724.42,599.85 727.27,592.97 729.70,583.50 C730.88,578.92 732.10,576.74 734.87,574.29 C736.87,572.53 738.84,571.06 739.25,571.04 C739.66,571.02 740.00,613.30 740.00,665.00 C740.00,739.57 739.74,758.99 738.75,758.94 C738.06,758.90 721.30,749.12 701.50,737.19 ZM 418.76 677.44 C415.60,676.68 411.10,675.08 408.76,673.88 C399.04,668.94 335.05,627.70 329.73,622.95 C307.02,602.70 299.47,567.28 311.89,539.30 C313.69,535.25 315.49,532.55 316.34,532.62 C317.12,532.69 322.77,535.83 328.88,539.61 L 340.00 546.48 L 340.01 556.99 C340.03,583.17 345.36,593.75 364.97,606.50 C380.31,616.47 414.20,637.58 417.95,639.50 C419.85,640.47 424.13,641.47 427.45,641.73 C434.43,642.26 438.09,640.65 457.50,628.55 C499.14,602.57 563.35,564.00 564.95,564.00 C565.65,564.00 566.00,570.50 566.00,583.35 C566.00,600.54 565.81,602.85 564.25,604.17 C562.66,605.52 538.87,620.27 498.00,645.23 C489.48,650.44 476.50,658.38 469.16,662.88 C451.53,673.68 447.03,675.88 439.13,677.56 C431.01,679.28 426.23,679.25 418.76,677.44 ZM 624.35 661.43 C624.71,658.84 625.00,649.68 625.00,641.09 L 625.00 625.45 L 644.65 611.97 C659.11,602.06 665.59,596.96 669.17,592.67 C679.80,579.95 682.62,569.34 681.19,547.35 C680.38,534.82 680.00,532.93 677.23,527.50 C673.05,519.29 667.87,514.71 651.50,504.72 C643.80,500.02 626.65,489.50 613.39,481.34 C600.12,473.18 572.35,456.15 551.67,443.50 C531.00,430.85 514.06,420.16 514.04,419.74 C513.99,418.89 528.69,409.32 544.04,400.21 C546.78,398.58 543.42,396.71 608.00,435.87 C614.88,440.04 636.66,453.19 656.41,465.09 C697.14,489.64 701.94,493.46 708.78,506.80 C715.62,520.12 716.50,525.23 716.50,551.50 C716.50,570.84 716.20,575.61 714.62,581.50 C710.68,596.21 703.65,608.36 692.63,619.49 C684.35,627.85 672.36,636.10 634.60,659.42 L 623.71 666.15 L 624.35 661.43 ZM 409.45 568.86 C376.48,548.98 345.24,530.19 340.03,527.11 C326.91,519.34 318.33,510.64 313.15,499.87 C307.29,487.67 306.00,479.78 306.00,456.23 C306.00,433.61 307.32,426.27 313.65,413.70 C323.22,394.70 332.65,386.59 374.85,361.09 C384.95,354.99 393.86,350.00 394.65,350.00 C395.88,350.00 396.03,352.84 395.66,368.59 C395.42,378.82 394.83,387.56 394.36,388.02 C393.89,388.48 385.40,394.09 375.50,400.50 C365.60,406.91 355.60,414.00 353.28,416.26 C343.40,425.86 339.19,440.34 340.28,460.92 C340.94,473.40 343.27,480.62 348.70,486.97 C353.28,492.32 351.26,491.01 412.50,528.03 C424.05,535.02 448.57,549.84 466.98,560.97 C485.40,572.10 501.29,581.79 502.29,582.49 C503.93,583.64 502.33,584.89 487.09,594.39 C477.72,600.22 469.91,605.00 469.73,605.00 C469.55,605.00 442.43,588.74 409.45,568.86 ZM 265.02 539.43 L 239.54 521.00 L 205.18 521.00 L 170.83 521.00 L 160.44 513.87 L 150.06 506.73 L 160.05 499.87 L 170.05 493.00 L 204.63 493.00 L 239.21 493.00 L 242.86 490.17 C252.36,482.77 290.06,456.00 290.97,456.00 C291.63,456.00 292.00,461.52 292.00,471.41 L 292.00 486.81 L 279.00 496.39 C271.85,501.65 266.01,506.31 266.02,506.73 C266.03,507.15 271.88,511.75 279.02,516.95 L 292.00 526.39 L 292.00 542.20 C292.00,550.89 291.66,557.97 291.25,557.93 C290.84,557.89 279.03,549.56 265.02,539.43 ZM 732.00 542.52 L 732.00 527.05 L 745.50 516.93 C752.92,511.36 759.00,506.72 759.00,506.61 C759.00,506.50 752.93,501.93 745.52,496.46 L 732.03 486.50 L 732.02 470.75 C732.01,462.09 732.34,455.01 732.75,455.01 C733.16,455.02 745.20,463.57 759.49,474.01 L 785.48 493.00 L 819.99 492.99 L 854.50 492.99 L 864.26 499.58 C869.62,503.21 873.76,506.57 873.46,507.06 C873.16,507.54 868.62,510.88 863.36,514.47 L 853.79 521.00 L 819.15 521.03 L 784.50 521.05 L 759.07 539.53 C745.08,549.69 733.27,558.00 732.82,558.00 C732.37,558.00 732.00,551.04 732.00,542.52 ZM 428.00 521.39 C421.12,517.22 413.81,512.94 411.75,511.88 L 408.00 509.96 L 408.00 428.69 C408.00,337.86 407.68,342.30 415.19,327.60 C418.89,320.36 421.41,317.42 438.92,299.97 C459.15,279.79 471.11,269.28 488.75,256.18 L 499.00 248.56 L 499.00 196.74 L 499.00 144.92 L 505.25 135.98 C508.69,131.06 511.73,127.04 512.00,127.03 C512.28,127.03 515.32,131.19 518.76,136.26 L 525.01 145.50 L 525.01 197.04 L 525.00 248.57 L 535.25 257.03 C551.91,270.76 566.67,284.70 578.30,297.66 C584.30,304.35 589.17,310.20 589.13,310.66 C589.08,311.12 585.55,311.81 581.27,312.18 C577.00,312.55 570.14,314.01 566.03,315.41 L 558.56 317.95 L 548.03 307.68 C522.23,282.52 514.87,278.59 503.50,283.92 C492.27,289.17 454.11,325.57 448.28,336.58 C441.80,348.82 442.00,345.52 442.00,441.71 C442.00,489.72 441.66,528.99 441.25,528.99 C440.84,528.98 434.88,525.56 428.00,521.39 ZM 694.50 471.56 L 682.50 464.31 L 681.86 448.90 C681.36,436.97 680.72,432.05 679.03,427.05 C676.40,419.28 671.16,411.14 665.96,406.74 C661.16,402.67 601.74,363.95 597.64,362.21 C592.44,360.01 583.98,359.66 579.06,361.44 C576.62,362.32 565.14,368.96 553.56,376.20 C541.98,383.43 527.78,392.28 522.00,395.86 C516.22,399.44 499.44,409.96 484.69,419.24 C469.95,428.52 457.24,436.36 456.44,436.66 C455.21,437.13 455.00,434.18 455.00,416.76 L 455.00 396.31 L 462.25 391.82 C466.24,389.35 489.46,374.84 513.85,359.57 C538.25,344.31 560.94,330.52 564.29,328.94 C572.70,324.96 579.81,323.69 590.44,324.27 C606.34,325.13 604.99,324.40 659.50,360.97 C688.35,380.32 700.16,390.71 707.28,403.00 C718.78,422.83 720.14,452.66 710.51,473.75 C709.19,476.64 707.75,478.96 707.31,478.91 C706.86,478.86 701.10,475.55 694.50,471.56 ZM 285.00 345.10 C285.00,251.88 285.09,246.82 286.75,247.46 C290.20,248.78 407.06,319.32 406.76,319.90 C399.87,333.50 399.68,333.76 394.43,336.78 L 389.17 339.80 L 359.84 322.30 C315.74,296.00 312.29,294.00 311.10,294.00 C310.31,294.00 310.00,308.35 310.00,344.08 L 310.00 394.15 L 306.05 400.83 C301.12,409.16 296.55,420.59 294.88,428.74 C293.82,433.94 292.89,435.67 289.30,439.19 L 285.00 443.42 L 285.00 345.10 ZM 734.93 438.65 C731.96,436.04 731.07,434.26 729.69,428.26 C727.35,418.05 722.62,406.26 717.97,399.07 L 714.00 392.93 L 714.00 343.47 C714.00,316.26 713.63,294.00 713.18,294.00 C712.73,294.00 701.59,300.36 688.43,308.13 C675.27,315.90 659.59,325.14 653.58,328.66 L 642.66 335.05 L 630.85 327.27 C624.35,323.00 619.14,319.18 619.27,318.80 C619.58,317.84 737.70,247.00 738.98,247.00 C740.17,247.00 740.42,438.79 739.23,440.65 C738.74,441.43 737.35,440.79 734.93,438.65 Z" fill="rgb(245,246,247)" />
                    </g>
                  </svg> */}
                  <img
                    src="./Veltrix2.png"
                    className="w-25 h-22"
                    // style={{ filter: 'brightness(2.8) drop-shadow(0 0 6px rgba(255,165,0,1.2))' }}
                  />
                </div>
                <h1 className="text-4xl font-semibold tracking-tight" style={{ color: 'rgba(255,255,255,0.95)', letterSpacing: '-1.5px' }}>
                  Veltrix AI
                </h1>
              </div>

              {/* Category chips */}
              <div className="fade-up-1 flex flex-wrap items-center justify-center gap-2 mb-7">
                {categories.map(cat => (
                  <button
                    key={cat}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
                    style={{
                      color: 'rgba(255,255,255,0.6)',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    {categoryIcons[cat]}{cat}
                  </button>
                ))}
              </div>

              {/* Search box */}
              <div
                className="fade-up-2 glass-light w-full rounded-2xl p-5"
                style={{
                  maxWidth: 720,
                  background: 'rgba(255,255,255,0.055)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
                }}
              >
                <textarea
                  className="search-textarea w-full bg-transparent border-none outline-none text-sm leading-relaxed"
                  style={{ color: 'rgba(255,255,255,0.85)', minHeight: 52 }}
                  placeholder="Ask anything..."
                  value={chatInput}
                  rows={2}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmitMessage(e) }
                  }}
                />
                <div className="flex items-center justify-between mt-3">
                  <button
                    className="flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      className="flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
                      </svg>
                    </button>
                    <button
                      className="flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                      style={chatInput.trim()
                        ? { background: 'linear-gradient(135deg, #5b8cf7, #7c5ce8)', boxShadow: '0 0 14px rgba(100,100,240,0.4)', color: 'white', border: 'none' }
                        : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.06)' }
                      }
                      onClick={handleSubmitMessage}
                      disabled={!chatInput.trim()}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent queries */}
              {Object.values(chats).length > 0 && (
                <div className="fade-up-3 flex flex-col gap-0.5 mt-5 w-full" style={{ maxWidth: 720 }}>
                  {Object.values(chats).slice(0, 4).map((c, i) => (
                    <button
                      key={i}
                      className="flex items-center gap-2.5 w-full text-left px-3.5 py-2 rounded-xl text-sm transition-all duration-200"
                      style={{ color: 'rgba(255,255,255,0.4)', background: 'transparent', border: 'none' }}
                      onClick={() => { setActiveChat(c.id); openChat(c.id) }}
                    >
                      <span className="w-1 h-1 rounded-full shrink-0" style={{ background: 'rgba(130,100,250,0.6)' }} />
                      {c.title}
                    </button>
                  ))}
                </div>
              )}
            </div>

          ) : (
            /* ── Chat view ── */
            <div className="flex flex-col flex-1 gap-2.5 min-h-0 overflow-hidden">

              <div className="custom-scrollbar flex-1 flex flex-col gap-2.5 overflow-y-auto py-2 pb-5">
                {chats[currentChatId]?.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`w-fit max-w-[72%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${message.role === 'user' ? 'ml-auto' : 'mr-auto'}`}
                    style={message.role === 'user'
                      ? {
                        background: 'linear-gradient(135deg, rgba(91,140,247,0.28), rgba(124,92,232,0.2))',
                        border: '1px solid rgba(124,92,232,0.28)',
                        color: 'rgba(255,255,255,0.9)',
                        borderRadius: '18px 18px 4px 18px',
                        boxShadow: '0 4px 20px rgba(100,100,240,0.15)',
                      }
                      : {
                        background: 'rgba(255,255,255,0.055)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        color: 'rgba(255,255,255,0.82)',
                        borderRadius: '18px 18px 18px 4px',
                      }
                    }
                  >
                    {message.role === 'ai' ? (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ children }) => <p className="mb-1.5 last:mb-0">{children}</p>,
                          ul: ({ children }) => <ul className="mb-2 list-disc pl-5">{children}</ul>,
                          ol: ({ children }) => <ol className="mb-2 list-decimal pl-5">{children}</ol>,
                          code: ({ children }) => <code className="rounded px-1 py-0.5 text-xs" style={{ background: 'rgba(255,255,255,0.1)' }}>{children}</code>,
                          pre: ({ children }) => <pre className="mb-2 overflow-x-auto rounded-xl p-3" style={{ background: 'rgba(0,0,0,0.35)' }}>{children}</pre>,
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    ) : (
                      <p>{message.content}</p>
                    )}
                  </div>
                ))}
              </div>

              <form
                onSubmit={handleSubmitMessage}
                className="glass flex items-center gap-3 px-4 py-3 rounded-2xl shrink-0"
                style={{
                  background: 'rgba(255,255,255,0.055)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 24px rgba(0,0,0,0.3)',
                }}
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  placeholder="Ask anything…"
                  className="chat-input flex-1 bg-transparent border-none outline-none text-sm"
                  style={{ color: 'rgba(255,255,255,0.85)' }}
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={chatInput.trim()
                    ? { background: 'linear-gradient(135deg, #5b8cf7, #7c5ce8)', boxShadow: '0 0 14px rgba(100,100,240,0.35)', border: 'none' }
                    : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)' }
                  }
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
                  </svg>
                </button>
              </form>

            </div>
          )}
        </main>
      </div>
    </>
  )
}

export default Dashboard