# Architecting a 15-Day Automated Mobile Release Train with Codemagic

**Published:** November 12, 2024  
**Author:** Eugenio Tesio  
**Read Time:** 6 min read  
**Topic:** CI/CD & Mobile Release Engineering  

---

Manual mobile app store submissions are a recipe for burnout and human error. When managing high-stakes banking applications distributed across **Apple App Store**, **Google Play Store**, and **Huawei AppGallery**, having a manual checklist leads to missed compliance gates, stale builds, and delayed business rollouts.

To solve this, we established a **predictable, automated 15-day Release Train** at ueno bank using **Codemagic** and **GitHub Actions**.

```
[Day 1-10: Feature Development]
       │
       ▼
[Day 11: Release Candidate Branch Cut]
       │  Automated Codemagic CI build & test suite
       ▼
[Day 12: Alpha & Internal QA Distribution]
       │  TestFlight, Google Internal Sharing, Huawei AppGallery Draft
       ▼
[Day 13-14: Regression & Smoke Verification]
       │  Golden UI tests, RASP validation, automated SAST gates
       ▼
[Day 15: Phased Store Rollout]
       │  20% -> 50% -> 100% staggered rollout with Sentry/New Relic alerts
```

## The Three Pillars of the Release Train

### 1. The Clockwork Branch Cut
Every second Tuesday at 18:00 UTC, a scheduled GitHub Action automatically branches off `release/vX.Y.Z` from `main`, bumps semantic version numbers across our pubspecs, and opens a Release Pull Request.

### 2. Multi-Store Signing & Codemagic Workflows
Signing certificates, provisioning profiles, and keystores are secured in encrypted secret managers. Codemagic pulls the exact build targets:

```yaml
workflows:
  banking-release:
    name: Production Release Train
    max_build_duration: 60
    environment:
      flutter: 3.24.x
      xcode: latest
    scripts:
      - name: Run Dart Analyzer & SAST
        script: flutter analyze && ./scripts/checkmarx_scan.sh
      - name: Build Android App Bundle (AAB)
        script: flutter build appbundle --release --obfuscate --split-debug-info=symbols/
      - name: Build iOS IPA
        script: flutter build ipa --release --export-options-plist=ExportOptions.plist
    artifacts:
      - build/**/outputs/**/*.aab
      - build/ios/ipa/*.ipa
    publishing:
      app_store_connect:
        auth: integration
        submit_to_testflight: true
      google_play:
        track: internal
```

### 3. Phased Rollouts & Real-Time Telemetry Guards
A release train isn't complete until you have real-time stop-the-line capabilities. We wire **New Relic** crash velocity and **Instabug** crash metrics directly into our incident response Slack channels:

- If crash-free sessions drop below **99.7%**, the phased rollout is paused automatically via store APIs.
- If no critical anomalies occur within 48 hours, the rollout advances smoothly to 100%.

## Results
- **95% reduction** in manual coordination overhead.
- Total cycle time from code freeze to store approval dropped from 8 days to **under 24 hours**.
- Zero missed compliance gates across 20+ consecutive bi-weekly cycles.
