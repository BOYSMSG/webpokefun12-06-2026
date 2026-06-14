import React from "react";

export default function ModpacksPage() {
  const customHtml = `
<div style="font-family:Arial, Helvetica, sans-serif;color:#eaeaea;background:#0f172a;padding:25px; border-radius:16px;">

	<h1 style="text-align:center;color:#38bdf8;">🌟 PokeFun Cobblemon Modpack</h1>

	<p style="text-align:center;font-size:16px;color:#cbd5f5;">Official Modpack Downloads &amp; Setup Guide (PC + Mobile + Cracked)</p>
	<hr style="border:1px solid #1e293b;margin:25px 0;">

	<h2 style="color:#22c55e;">📦 Official Modpack Downloads</h2>
	<div style="background:#020617;padding:20px;margin-bottom:15px;border-radius:8px;">

		<h3 style="color:#f97316;margin-bottom:15px;">🔹 CurseForge (Recommended &ndash; PC)</h3>

		<p style="margin-bottom:20px;">Best stability, auto-updates, and easiest installation.</p><a href="https://www.curseforge.com/minecraft/modpacks/pokefun-cobblemon" rel="noreferrer noopener" style="background:#f97316;color:#000;padding:12px 18px;text-decoration:none;font-weight:bold;border-radius:6px;display:inline-block;" target="_blank">&nbsp;Download from CurseForge</a></div>
	<div style="background:#020617;padding:20px;margin-bottom:15px;border-radius:8px;">

		<h3 style="color:#38bdf8;margin-bottom:15px;">🔹 Modrinth / Direct Modpack (ZIP)</h3>

		<p style="margin-bottom:20px;">Direct file download for custom launchers.</p><a href="https://modrinth.com/modpack/pokefun" rel="noreferrer noopener" style="background:#38bdf8;color:#000;padding:12px 18px;text-decoration:none;font-weight:bold;border-radius:6px;display:inline-block;" target="_blank">&nbsp;Download Modpack ZIP</a></div>
	<div style="background:#020617;padding:20px;border-radius:8px;">

		<h3 style="color:#ef4444;margin-bottom:15px;">🔹 Manual Download (Advanced Users)</h3>

		<p style="margin-bottom:20px;">Manual setup required. Use only if you know what you&rsquo;re doing.</p><a href="https://drive.google.com/file/d/1BQimQ-5qJgjGDprMb94cKzxoUJ7W4Cp0/view?usp=sharing" rel="noreferrer noopener" style="background:#ef4444;color:#fff;padding:12px 18px;text-decoration:none;font-weight:bold;border-radius:6px;display:inline-block;" target="_blank">&nbsp;Manual Modpack Download</a></div>
	<hr style="border:1px solid #1e293b;margin:30px 0;">

	<h2 style="color:#22c55e;">📱 Mobile Players Guide (Android)</h2>
	<div style="background:#020617;padding:20px;border-radius:8px;">

		<ul style="line-height:1.8;margin-bottom:20px;">
			<li>✅ Use <strong>Mojo Launcher</strong> (Play Store)</li>
			<li>⚙️ Custom controls recommended for smooth gameplay</li>
			<li>📉 Devices under <strong>6GB RAM</strong>: Use <span style="color:#facc15;">Potato Modpack (Beta)</span></li>
		</ul>

		<h4 style="color:#38bdf8;margin-bottom:10px;">How to Import Modpack</h4>

		<ol style="line-height:1.8;margin-bottom:20px;padding-left:20px;">
			<li>Open Mojo Launcher</li>
			<li>Login (Offline supported)</li>
			<li>Tap ⬆ Create Instance</li>
			<li>Select <strong>Create Modpack Instance</strong></li>
			<li>Search <strong>Pok&eacute;Fun</strong></li>
			<li>Download latest version (or Potato for low-end)</li>
		</ol>

		<p style="color:#facc15;background:#1a1005;padding:15px;border-radius:8px;"><strong>IMPORTANT SETTINGS:</strong>
			<br>Mojo Launcher &rarr; ☰ Settings &rarr; Video &amp; Renderer &rarr; Renderer &rarr; <strong>Use LTW (OpenGL ES 3)</strong>
			<br>Mojo Launcher &rarr; ☰ Settings &rarr; Java Tweaks &rarr; Allocate <strong>2048&ndash;6144 MB RAM</strong></p>
	</div>
	<hr style="border:1px solid #1e293b;margin:30px 0;">

	<h2 style="color:#38bdf8;">🎮 Default Mobile Controls (Mojo Launcher)</h2>
	<div style="background:#020617;padding:20px;border-radius:8px;">

		<p style="margin-bottom:20px;">For the best Pok&eacute;Fun Cobblemon experience on mobile, we strongly recommend using our <strong>official default control layout</strong> designed for battles, movement, and menus.</p><a href="https://drive.google.com/file/d/1cKrdzKCoLeH9vbzwehHf5sO0JpxGCBi6/view?usp=sharing" rel="noreferrer noopener" style="background:#22c55e;color:#000;padding:12px 18px;text-decoration:none;font-weight:bold;display:inline-block;border-radius:6px;" target="_blank">&nbsp;Download Pok&eacute;Fun Mobile Controls&nbsp;</a>

		<h4 style="color:#facc15;margin-top:25px;margin-bottom:10px;">How to Import Controls</h4>

		<ol style="line-height:1.8;padding-left:20px;">
			<li>Download the controls file</li>
			<li>Open Mojo Launcher</li>
			<li>Go to Controls / Input Settings</li>
			<li>Import the downloaded controls file</li>
			<li>Apply &amp; restart the game</li>
		</ol>
	</div>
	<hr style="border:1px solid #1e293b;margin:30px 0;">

	<h2 style="color:#22c55e;">💻 PC Players Guide (Cracked &amp; Premium)</h2>
	<div style="background:#020617;padding:20px;border-radius:8px;">

		<p style="margin-bottom:15px;">Recommended launcher for cracked players: <strong>SK Launcher</strong></p>

		<h4 style="color:#38bdf8;margin-bottom:10px;">Installation Steps</h4>

		<ol style="line-height:1.8;margin-bottom:15px;padding-left:20px;">
			<li>Download Pok&eacute;Fun Modpack from CurseForge</li>
			<li>Open SK Launcher</li>
			<li>Login (Offline or Premium)</li>
			<li>Open <strong>Installation Manager (click text, not +)</strong></li>
			<li>Click <strong>Import Modpack</strong></li>
			<li>Select downloaded modpack file</li>
		</ol>

		<p style="color:#22c55e;">✔ Minecraft &amp; mods install automatically</p>
	</div>
	<hr style="border:1px solid #1e293b;margin:30px 0;">

	<h2 style="color:#ef4444;">🧰 Manual Install (Any Launcher)</h2>
	<div style="background:#020617;padding:20px;border-radius:8px;">

		<ol style="line-height:1.8;padding-left:20px;">
			<li>Download Manual Modpack ZIP</li>
			<li>Extract all files</li>
			<li>Paste into:<pre style="background:#020617;padding:10px;color:#38bdf8;margin:10px 0;border:1px solid #1e293b;border-radius:6px;white-space:pre-wrap;">/.minecraft folder in you launcher
you can direct open with open launcher than download 1.21.1 Minecraft fabric and open folder end extract all files from manual mod</pre></li>
			<li>Ensure correct Minecraft &amp; Fabric version</li>
		</ol>
	</div>

	<p style="text-align:center;margin-top:40px;color:#94a3b8;font-weight:bold;">Pok&eacute;Fun SMP &bull; PC &bull; Mobile &bull; Cracked &bull; Premium</p>
</div>
  `;

  return (
    <div className="inner" style={{ padding: "80px 0", maxWidth: "1000px", margin: "0 auto" }}>
      <div dangerouslySetInnerHTML={{ __html: customHtml }} />
    </div>
  );
}
