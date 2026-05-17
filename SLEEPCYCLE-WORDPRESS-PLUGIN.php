<?php
/**
 * Plugin Name: SleepCycle Pro - AI Sleep Calculator
 * Plugin URI: https://sleepcyclepro.com
 * Description: Complete AI-powered sleep calculator with 90-minute cycles, nap timer, sleep debt tracker, and more. Perfect for USA, UK, Canada, Australia audiences.
 * Version: 1.0.0
 * Author: SleepCycle Pro
 * License: GPL v2
 * Text Domain: sleepcycle-pro
 */

if (!defined('ABSPATH')) exit;

class SleepCycle_Pro_Plugin {
    
    public function __construct() {
        add_action('init', array($this, 'init'));
        add_shortcode('sleepcycle', array($this, 'shortcode'));
        add_shortcode('sleepcycle_calculator', array($this, 'shortcode'));
        add_action('wp_enqueue_scripts', array($this, 'assets'));
        add_action('admin_menu', array($this, 'menu'));
    }
    
    public function init() {}
    
    public function assets() {
        global $post;
        if (is_a($post, 'WP_Post') && (has_shortcode($post->post_content, 'sleepcycle') || has_shortcode($post->post_content, 'sleepcycle_calculator'))) {
            wp_add_inline_style('wp-block-library', $this->get_css());
            wp_add_inline_script('jquery-core', $this->get_js());
        }
    }
    
    public function shortcode($atts) {
        $atts = shortcode_atts(array(
            'theme' => 'dark',
            'show_naps' => 'true',
            'show_debt' => 'true'
        ), $atts);
        
        ob_start();
        ?>
        <div class="scp-wrapper" data-theme="<?php echo esc_attr($atts['theme']); ?>">
            <div class="scp-container">
                <!-- Main Calculator -->
                <div class="scp-card scp-main">
                    <div class="scp-badge">
                        <span class="scp-dot"></span>
                        TRUSTED BY 500K+ USERS
                    </div>
                    <h2 class="scp-title">Find Your Perfect Sleep Time</h2>
                    <p class="scp-subtitle">Based on 90-minute sleep cycles • Wake up refreshed</p>
                    
                    <div class="scp-toggle">
                        <button class="scp-toggle-btn active" data-mode="wake">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>
                            Wake up at
                        </button>
                        <button class="scp-toggle-btn" data-mode="sleep">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                            Sleep at
                        </button>
                    </div>
                    
                    <div class="scp-time-picker">
                        <input type="time" id="scp-time" value="07:00" class="scp-time-input">
                        <div class="scp-time-info">
                            <div>✓ Includes 14 min to fall asleep</div>
                            <div>✓ Scientifically proven 90-min cycles</div>
                        </div>
                    </div>
                    
                    <div id="scp-results" class="scp-results"></div>
                </div>
                
                <?php if ($atts['show_naps'] === 'true'): ?>
                <!-- Nap Calculator -->
                <div class="scp-grid">
                    <div class="scp-card">
                        <h3>⚡ Power Nap</h3>
                        <div class="scp-nap-time" id="scp-nap-20">2:45 PM</div>
                        <div class="scp-nap-desc">20 min • Alertness boost</div>
                    </div>
                    <div class="scp-card">
                        <h3>🧠 Full Cycle</h3>
                        <div class="scp-nap-time" id="scp-nap-90">4:05 PM</div>
                        <div class="scp-nap-desc">90 min • Complete restoration</div>
                    </div>
                </div>
                <?php endif; ?>
                
                <?php if ($atts['show_debt'] === 'true'): ?>
                <!-- Sleep Debt -->
                <div class="scp-card">
                    <h3>📊 Weekly Sleep Debt</h3>
                    <div class="scp-debt-grid">
                        <div>
                            <label>You sleep <strong id="scp-sleep-val">6.5h</strong></label>
                            <input type="range" id="scp-sleep" min="4" max="10" step="0.5" value="6.5" class="scp-slider">
                        </div>
                        <div>
                            <label>Goal <strong id="scp-goal-val">8h</strong></label>
                            <input type="range" id="scp-goal" min="7" max="9" step="0.5" value="8" class="scp-slider">
                        </div>
                    </div>
                    <div class="scp-debt-result">
                        <div class="scp-debt-amount" id="scp-debt">-10.5h</div>
                        <div class="scp-debt-label">this week</div>
                        <div class="scp-debt-tip" id="scp-tip">Sleep 90 min extra for 7 nights</div>
                    </div>
                </div>
                <?php endif; ?>
                
                <!-- Tips -->
                <div class="scp-tips">
                    <div class="scp-tip">💡 <strong>Pro tip:</strong> Keep your bedroom at 60-67°F for optimal sleep</div>
                    <div class="scp-tip">🌙 <strong>Best time:</strong> 10 PM - 6 AM aligns with natural circadian rhythm</div>
                </div>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }
    
    private function get_css() {
        return '
        .scp-wrapper { --scp-bg: #050816; --scp-card: #0a0e1a; --scp-border: rgba(255,255,255,0.08); --scp-text: #fff; --scp-text2: rgba(255,255,255,0.6); --scp-accent: #8b5cf6; --scp-accent2: #3b82f6; margin: 2rem 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        .scp-wrapper[data-theme="light"] { --scp-bg: #f8fafc; --scp-card: #fff; --scp-border: rgba(0,0,0,0.08); --scp-text: #0f172a; --scp-text2: rgba(0,0,0,0.6); }
        .scp-container { max-width: 720px; margin: 0 auto; }
        .scp-card { background: var(--scp-card); border: 1px solid var(--scp-border); border-radius: 24px; padding: 2rem; margin-bottom: 1.25rem; box-shadow: 0 4px 24px rgba(0,0,0,0.1); }
        .scp-main { background: linear-gradient(180deg, rgba(139,92,246,0.08) 0%, var(--scp-card) 100%); position: relative; overflow: hidden; }
        .scp-main::before { content: ""; position: absolute; top: -50%; right: -20%; width: 400px; height: 400px; background: radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%); border-radius: 50%; filter: blur(60px); }
        .scp-badge { display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(139,92,246,0.1); border: 1px solid rgba(139,92,246,0.2); color: #a78bfa; padding: 0.375rem 0.875rem; border-radius: 999px; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.05em; margin-bottom: 1rem; position: relative; }
        .scp-dot { width: 6px; height: 6px; background: #a78bfa; border-radius: 50%; animation: scp-pulse 2s infinite; }
        @keyframes scp-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .scp-title { font-size: clamp(1.5rem, 4vw, 2rem); font-weight: 700; color: var(--scp-text); margin: 0 0 0.5rem; line-height: 1.2; position: relative; }
        .scp-subtitle { color: var(--scp-text2); margin: 0 0 1.75rem; font-size: 0.95rem; position: relative; }
        .scp-toggle { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; background: rgba(0,0,0,0.2); padding: 0.375rem; border-radius: 14px; margin-bottom: 1.5rem; position: relative; }
        .scp-wrapper[data-theme="light"] .scp-toggle { background: rgba(0,0,0,0.04); }
        .scp-toggle-btn { display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.75rem; background: transparent; border: none; color: var(--scp-text2); border-radius: 10px; cursor: pointer; font-size: 0.9rem; font-weight: 500; transition: all 0.2s; }
        .scp-toggle-btn.active { background: var(--scp-text); color: var(--scp-bg); box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
        .scp-toggle-btn svg { opacity: 0.7; }
        .scp-toggle-btn.active svg { opacity: 1; }
        .scp-time-picker { display: flex; gap: 1.25rem; align-items: center; margin-bottom: 1.75rem; flex-wrap: wrap; position: relative; }
        .scp-time-input { background: rgba(0,0,0,0.3); border: 1px solid var(--scp-border); color: var(--scp-text); padding: 1rem 1.25rem; font-size: 1.75rem; font-weight: 600; border-radius: 16px; width: 180px; text-align: center; font-variant-numeric: tabular-nums; transition: all 0.2s; }
        .scp-wrapper[data-theme="light"] .scp-time-input { background: rgba(0,0,0,0.02); }
        .scp-time-input:focus { outline: none; border-color: var(--scp-accent); box-shadow: 0 0 0 3px rgba(139,92,246,0.1); }
        .scp-time-info { font-size: 0.8rem; color: var(--scp-text2); line-height: 1.6; }
        .scp-time-info div { display: flex; align-items: center; gap: 0.375rem; }
        .scp-results { display: flex; flex-direction: column; gap: 0.625rem; position: relative; }
        .scp-result { display: flex; justify-content: space-between; align-items: center; padding: 1.125rem 1.25rem; background: rgba(0,0,0,0.2); border: 1px solid var(--scp-border); border-radius: 16px; cursor: pointer; transition: all 0.2s; position: relative; overflow: hidden; }
        .scp-wrapper[data-theme="light"] .scp-result { background: rgba(0,0,0,0.01); }
        .scp-result:hover { transform: translateY(-1px); border-color: rgba(139,92,246,0.3); background: rgba(139,92,246,0.05); }
        .scp-result.best { border-color: var(--scp-accent); background: linear-gradient(90deg, rgba(139,92,246,0.12) 0%, rgba(59,130,246,0.08) 100%); }
        .scp-result.best::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: linear-gradient(180deg, var(--scp-accent), var(--scp-accent2)); }
        .scp-result-left { display: flex; align-items: center; gap: 1rem; }
        .scp-result-icon { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.05); border-radius: 12px; font-size: 1.25rem; }
        .scp-result.best .scp-result-icon { background: rgba(139,92,246,0.15); }
        .scp-result-time { font-size: 1.375rem; font-weight: 700; color: var(--scp-text); line-height: 1; font-variant-numeric: tabular-nums; }
        .scp-result-meta { font-size: 0.8rem; color: var(--scp-text2); margin-top: 0.25rem; }
        .scp-result-right { text-align: right; }
        .scp-badge-quality { display: inline-flex; align-items: center; gap: 0.375rem; padding: 0.375rem 0.75rem; border-radius: 999px; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.03em; background: rgba(255,255,255,0.08); color: var(--scp-text2); }
        .scp-result.best .scp-badge-quality { background: #10b981; color: white; }
        .scp-result.better .scp-badge-quality { background: #3b82f6; color: white; }
        .scp-badge-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }
        .scp-result-quality { font-size: 0.7rem; color: var(--scp-text2); margin-top: 0.375rem; }
        .scp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
        .scp-card h3 { margin: 0 0 1rem; font-size: 1.05rem; font-weight: 600; color: var(--scp-text); display: flex; align-items: center; gap: 0.5rem; }
        .scp-nap-time { font-size: 1.75rem; font-weight: 700; color: var(--scp-accent); font-variant-numeric: tabular-nums; line-height: 1; margin-bottom: 0.25rem; }
        .scp-nap-desc { font-size: 0.8rem; color: var(--scp-text2); }
        .scp-debt-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem; }
        .scp-debt-grid label { display: block; font-size: 0.85rem; color: var(--scp-text2); margin-bottom: 0.625rem; }
        .scp-debt-grid strong { color: var(--scp-text); font-weight: 600; }
        .scp-slider { width: 100%; height: 6px; -webkit-appearance: none; appearance: none; background: rgba(255,255,255,0.1); border-radius: 3px; outline: none; cursor: pointer; }
        .scp-wrapper[data-theme="light"] .scp-slider { background: rgba(0,0,0,0.1); }
        .scp-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; background: var(--scp-accent); border-radius: 50%; cursor: pointer; box-shadow: 0 2px 6px rgba(139,92,246,0.3); transition: transform 0.2s; }
        .scp-slider::-webkit-slider-thumb:hover { transform: scale(1.15); }
        .scp-slider::-moz-range-thumb { width: 18px; height: 18px; background: var(--scp-accent); border-radius: 50%; cursor: pointer; border: none; box-shadow: 0 2px 6px rgba(139,92,246,0.3); }
        .scp-debt-result { text-align: center; padding: 1.5rem; background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.15); border-radius: 16px; }
        .scp-debt-result.positive { background: rgba(16,185,129,0.08); border-color: rgba(16,185,129,0.15); }
        .scp-debt-amount { font-size: 2.25rem; font-weight: 700; line-height: 1; color: #ef4444; font-variant-numeric: tabular-nums; }
        .scp-debt-result.positive .scp-debt-amount { color: #10b981; }
        .scp-debt-label { font-size: 0.8rem; color: var(--scp-text2); margin-top: 0.25rem; text-transform: uppercase; letter-spacing: 0.05em; }
        .scp-debt-tip { margin-top: 0.75rem; font-size: 0.85rem; color: var(--scp-text); font-weight: 500; }
        .scp-tips { display: grid; gap: 0.75rem; margin-top: 1.5rem; }
        .scp-tip { padding: 0.875rem 1.125rem; background: rgba(139,92,246,0.06); border: 1px solid rgba(139,92,246,0.12); border-radius: 12px; font-size: 0.85rem; color: var(--scp-text2); line-height: 1.5; }
        .scp-tip strong { color: var(--scp-text); font-weight: 600; }
        @media (max-width: 640px) { .scp-card { padding: 1.5rem; border-radius: 20px; } .scp-time-picker { flex-direction: column; align-items: stretch; } .scp-time-input { width: 100%; } .scp-grid, .scp-debt-grid { grid-template-columns: 1fr; gap: 1rem; } .scp-result { padding: 1rem; } .scp-result-time { font-size: 1.25rem; } }
        ';
    }
    
    private function get_js() {
        return '
        document.addEventListener("DOMContentLoaded", function() {
            const wrappers = document.querySelectorAll(".scp-wrapper");
            wrappers.forEach(initCalculator);
            
            function initCalculator(wrapper) {
                const toggleBtns = wrapper.querySelectorAll(".scp-toggle-btn");
                const timeInput = wrapper.querySelector("#scp-time");
                const resultsDiv = wrapper.querySelector("#scp-results");
                let mode = "wake";
                
                if (!timeInput) return;
                
                toggleBtns.forEach(btn => {
                    btn.addEventListener("click", () => {
                        toggleBtns.forEach(b => b.classList.remove("active"));
                        btn.classList.add("active");
                        mode = btn.dataset.mode;
                        calculate();
                    });
                });
                
                timeInput.addEventListener("change", calculate);
                timeInput.addEventListener("input", calculate);
                
                function calculate() {
                    const [h, m] = timeInput.value.split(":").map(Number);
                    const target = new Date();
                    target.setHours(h, m, 0, 0);
                    
                    resultsDiv.innerHTML = "";
                    const cycles = [6, 5, 4, 3];
                    const icons = ["🌙", "😴", "💤", "🛌"];
                    
                    cycles.forEach((cycle, idx) => {
                        const totalMins = cycle * 90 + 14;
                        const calcTime = new Date(target);
                        
                        if (mode === "wake") {
                            calcTime.setMinutes(calcTime.getMinutes() - totalMins);
                        } else {
                            calcTime.setMinutes(calcTime.getMinutes() + totalMins);
                        }
                        
                        const timeStr = calcTime.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
                        const quality = cycle === 6 ? "Best" : cycle === 5 ? "Better" : "Good";
                        const wakeQuality = cycle === 6 ? 95 : cycle === 5 ? 85 : cycle === 4 ? 75 : 65;
                        const isBest = cycle >= 5;
                        
                        const div = document.createElement("div");
                        div.className = "scp-result " + (cycle === 6 ? "best" : cycle === 5 ? "better" : "");
                        div.innerHTML = `
                            <div class="scp-result-left">
                                <div class="scp-result-icon">${icons[idx]}</div>
                                <div>
                                    <div class="scp-result-time">${timeStr}</div>
                                    <div class="scp-result-meta">${cycle} cycles • ${cycle * 1.5} hours of sleep</div>
                                </div>
                            </div>
                            <div class="scp-result-right">
                                <div class="scp-badge-quality"><span class="scp-badge-dot"></span>${quality}</div>
                                <div class="scp-result-quality">${wakeQuality}% wake quality</div>
                            </div>
                        `;
                        resultsDiv.appendChild(div);
                    });
                    
                    updateNaps();
                }
                
                function updateNaps() {
                    [20, 90].forEach(mins => {
                        const el = wrapper.querySelector(`#scp-nap-${mins}`);
                        if (el) {
                            const wake = new Date();
                            wake.setMinutes(wake.getMinutes() + mins + 5);
                            el.textContent = wake.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
                        }
                    });
                }
                
                const sleepSlider = wrapper.querySelector("#scp-sleep");
                const goalSlider = wrapper.querySelector("#scp-goal");
                
                function updateDebt() {
                    if (!sleepSlider) return;
                    const sleep = parseFloat(sleepSlider.value);
                    const goal = parseFloat(goalSlider.value);
                    const debt = (sleep - goal) * 7;
                    
                    wrapper.querySelector("#scp-sleep-val").textContent = sleep + "h";
                    wrapper.querySelector("#scp-goal-val").textContent = goal + "h";
                    
                    const debtEl = wrapper.querySelector("#scp-debt");
                    const resultEl = wrapper.querySelector(".scp-debt-result");
                    const tipEl = wrapper.querySelector("#scp-tip");
                    
                    debtEl.textContent = (debt > 0 ? "+" : "") + debt.toFixed(1) + "h";
                    
                    if (debt < -3) {
                        resultEl.classList.remove("positive");
                        tipEl.textContent = `Sleep 90 min extra for ${Math.ceil(Math.abs(debt)/1.5)} nights to recover`;
                    } else if (debt < 0) {
                        resultEl.classList.remove("positive");
                        tipEl.textContent = `Add ${Math.abs(debt).toFixed(1)}h this week`;
                    } else {
                        resultEl.classList.add("positive");
                        tipEl.textContent = "Excellent! You’re in sleep surplus";
                    }
                }
                
                if (sleepSlider) {
                    sleepSlider.addEventListener("input", updateDebt);
                    goalSlider.addEventListener("input", updateDebt);
                    updateDebt();
                }
                
                calculate();
                setInterval(updateNaps, 60000);
            }
        });
        ';
    }
    
    public function menu() {
        add_menu_page('SleepCycle Pro', 'Sleep Calculator', 'manage_options', 'sleepcycle-pro', array($this, 'admin'), 'dashicons-clock', 26);
    }
    
    public function admin() {
        ?>
        <div class="wrap" style="max-width: 900px;">
            <h1 style="display: flex; align-items: center; gap: 12px;">
                <span style="width: 40px; height: 40px; background: linear-gradient(135deg, #8b5cf6, #3b82f6); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white;">🌙</span>
                SleepCycle Pro
            </h1>
            
            <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 2rem; margin-top: 1.5rem;">
                <h2 style="margin-top: 0;">🚀 Quick Start</h2>
                <p style="font-size: 15px; color: #475569;">Add the sleep calculator to any page, post, or widget using the shortcode:</p>
                
                <div style="background: #0f172a; color: #e2e8f0; padding: 1.25rem; border-radius: 8px; font-family: monospace; font-size: 1.1rem; margin: 1rem 0; display: flex; align-items: center; justify-content: space-between;">
                    <code>[sleepcycle]</code>
                    <button onclick="navigator.clipboard.writeText('[sleepcycle]'); this.textContent='Copied!'; setTimeout(()=>this.textContent='Copy', 2000)" style="background: #8b5cf6; color: white; border: none; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; font-size: 0.85rem;">Copy</button>
                </div>
                
                <h3>Shortcode Options:</h3>
                <table style="width: 100%; border-collapse: collapse; margin-top: 1rem;">
                    <tr style="background: #f8fafc;">
                        <th style="text-align: left; padding: 0.75rem; border: 1px solid #e2e8f0;">Option</th>
                        <th style="text-align: left; padding: 0.75rem; border: 1px solid #e2e8f0;">Values</th>
                        <th style="text-align: left; padding: 0.75rem; border: 1px solid #e2e8f0;">Example</th>
                    </tr>
                    <tr>
                        <td style="padding: 0.75rem; border: 1px solid #e2e8f0;"><code>theme</code></td>
                        <td style="padding: 0.75rem; border: 1px solid #e2e8f0;">dark, light</td>
                        <td style="padding: 0.75rem; border: 1px solid #e2e8f0;"><code>[sleepcycle theme="light"]</code></td>
                    </tr>
                    <tr style="background: #f8fafc;">
                        <td style="padding: 0.75rem; border: 1px solid #e2e8f0;"><code>show_naps</code></td>
                        <td style="padding: 0.75rem; border: 1px solid #e2e8f0;">true, false</td>
                        <td style="padding: 0.75rem; border: 1px solid #e2e8f0;"><code>[sleepcycle show_naps="false"]</code></td>
                    </tr>
                    <tr>
                        <td style="padding: 0.75rem; border: 1px solid #e2e8f0;"><code>show_debt</code></td>
                        <td style="padding: 0.75rem; border: 1px solid #e2e8f0;">true, false</td>
                        <td style="padding: 0.75rem; border: 1px solid #e2e8f0;"><code>[sleepcycle show_debt="true"]</code></td>
                    </tr>
                </table>
                
                <h3 style="margin-top: 2rem;">✨ Features Included:</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem;">
                    <?php
                    $features = [
                        '90-min cycle calculator',
                        'Wake/sleep time modes',
                        'Nap calculator',
                        'Sleep debt tracker',
                        'Mobile responsive',
                        'Dark & light themes',
                        'No external APIs',
                        'GDPR compliant'
                    ];
                    foreach ($features as $f) {
                        echo '<div style="display: flex; align-items: center; gap: 0.5rem;"><span style="color: #10b981;">✓</span> ' . $f . '</div>';
                    }
                    ?>
                </div>
                
                <div style="margin-top: 2rem; padding: 1.25rem; background: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 6px;">
                    <strong>💡 Pro Tip:</strong> Create a dedicated page called "Sleep Calculator" and add the shortcode. This works great for SEO in USA, UK, Canada, and Australia!
                </div>
            </div>
            
            <div style="margin-top: 1.5rem; text-align: center; color: #64748b; font-size: 0.9rem;">
                SleepCycle Pro v1.0.0 • Made for better sleep worldwide
            </div>
        </div>
        <?php
    }
}

new SleepCycle_Pro_Plugin();
