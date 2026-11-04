import type { ComponentProps, ReactNode } from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Link,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';
import type { CvContent, CvJob } from '../../data/cv/content';

/** Disable mid-word hyphenation so wrapping matches the reference CV. */
const noHyphen = (word: string) => [word];

function T({
  children,
  ...props
}: ComponentProps<typeof Text> & { children?: ReactNode }) {
  return (
    <Text hyphenationCallback={noHyphen} {...props}>
      {children}
    </Text>
  );
}

function getCvProfileSrc(): string {
  const nodePath = (globalThis as { __CV_PROFILE_PATH__?: string }).__CV_PROFILE_PATH__;
  if (nodePath) return nodePath;
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/cv-profile.png`;
  }
  return '/cv-profile.png';
}

const colors = {
  headerBg: '#0F172A',
  accent: '#2563EB',
  accentSoft: '#60A5FA',
  sidebarBg: '#F7F8FC',
  ink: '#0F172A',
  body: '#1E293B',
  bullet: '#334155',
  muted: '#64748B',
  skill: '#475569',
  rule: '#E2E8F0',
  ruleSoft: '#CBD5E1',
  timelineLine: '#DBEAFE',
  footer: '#94A3B8',
  white: '#FFFFFF',
  contactMuted: '#CBD5E1',
  headerContact: '#93C5FD',
};

const SIDEBAR_W = 198.4;
const PAGE_PAD_X = 34;
const RIGHT_X = 223.9;
const CONTENT_RIGHT = 558.4;
const RIGHT_W = CONTENT_RIGHT - RIGHT_X;

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9.5,
    color: colors.ink,
    backgroundColor: colors.white,
  },
  // —— Header page 1 ——
  headerAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 7.1,
    backgroundColor: colors.accent,
  },
  header: {
    backgroundColor: colors.headerBg,
    paddingTop: 25,
    paddingBottom: 22,
    paddingHorizontal: PAGE_PAD_X,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTextCol: {
    flex: 1,
    paddingRight: 16,
    paddingTop: 2,
  },
  name: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 23,
    color: colors.white,
    marginBottom: 4,
  },
  roleHeader: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
    color: colors.accentSoft,
    marginBottom: 12,
  },
  headerContact: {
    fontSize: 8.8,
    color: colors.contactMuted,
    marginBottom: 4,
  },
  headerContactLink: {
    fontSize: 8.8,
    color: colors.contactMuted,
    textDecoration: 'none',
  },
  photoWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    overflow: 'hidden',
  },
  photo: {
    width: 88,
    height: 88,
    objectFit: 'cover',
  },
  // —— Header page 2 ——
  headerCompactAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 5.7,
    backgroundColor: colors.accent,
  },
  headerCompact: {
    backgroundColor: colors.headerBg,
    height: 56.7,
    paddingTop: 18,
    paddingHorizontal: PAGE_PAD_X,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerCompactLeft: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
  },
  nameCompact: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
    color: colors.white,
  },
  roleCompact: {
    fontSize: 8.8,
    color: colors.headerContact,
  },
  headerCompactContact: {
    fontSize: 8.2,
    color: colors.contactMuted,
  },
  // —— Body columns ——
  body: {
    flexDirection: 'row',
    flexGrow: 1,
  },
  sidebar: {
    width: SIDEBAR_W,
    backgroundColor: colors.sidebarBg,
    paddingTop: 24,
    paddingBottom: 28,
    paddingHorizontal: PAGE_PAD_X,
    borderRightWidth: 1,
    borderRightColor: colors.rule,
  },
  main: {
    flex: 1,
    paddingTop: 24,
    paddingBottom: 28,
    paddingLeft: RIGHT_X - SIDEBAR_W,
    paddingRight: 595.28 - CONTENT_RIGHT,
  },
  // —— Sidebar ——
  sideSectionTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    color: colors.accent,
    letterSpacing: 0.4,
    marginBottom: 10,
  },
  sideRule: {
    borderBottomWidth: 0.85,
    borderBottomColor: colors.ruleSoft,
    marginBottom: 12,
  },
  impactBlock: {
    marginBottom: 12,
  },
  impactValue: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
    color: colors.accent,
    marginBottom: 3,
  },
  impactTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 8.8,
    color: colors.ink,
    marginBottom: 4,
  },
  impactDetail: {
    fontSize: 8,
    color: colors.muted,
    lineHeight: 1.35,
  },
  skillGroup: {
    marginBottom: 8,
  },
  skillLabel: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    color: colors.ink,
    marginBottom: 2,
  },
  skillValues: {
    fontSize: 8.2,
    color: colors.skill,
    lineHeight: 1.3,
  },
  eduDegree: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9.2,
    color: colors.ink,
    marginBottom: 8,
    lineHeight: 1.3,
  },
  eduPeriod: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 8.4,
    color: colors.accent,
    marginBottom: 3,
  },
  eduInstitution: {
    fontSize: 8.4,
    color: colors.bullet,
    marginBottom: 10,
    lineHeight: 1.35,
  },
  eduDetail: {
    fontSize: 8.1,
    color: colors.muted,
    lineHeight: 1.35,
  },
  langRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  langName: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    color: colors.ink,
  },
  langLevel: {
    fontSize: 8.5,
    color: colors.muted,
  },
  contactLabel: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 7.8,
    color: colors.muted,
    marginBottom: 2,
    marginTop: 8,
  },
  contactValue: {
    fontSize: 8.3,
    color: colors.ink,
  },
  contactLink: {
    fontSize: 8.3,
    color: colors.ink,
    textDecoration: 'none',
  },
  // —— Main column ——
  mainSectionTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9.6,
    color: colors.accent,
    letterSpacing: 0.3,
    marginBottom: 8,
  },
  mainRule: {
    borderBottomWidth: 1,
    borderBottomColor: colors.rule,
    marginBottom: 12,
  },
  summary: {
    fontSize: 9.4,
    color: colors.body,
    lineHeight: 1.4,
    marginBottom: 18,
  },
  // —— Timeline job ——
  job: {
    marginBottom: 16,
    paddingLeft: 14,
    position: 'relative',
  },
  timelineDot: {
    position: 'absolute',
    left: 0,
    top: 3,
    width: 7.4,
    height: 7.4,
    borderRadius: 3.7,
    backgroundColor: colors.accent,
  },
  timelineLine: {
    position: 'absolute',
    left: 3.3,
    top: 14,
    bottom: 0,
    width: 1.1,
    backgroundColor: colors.timelineLine,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  jobRole: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10.5,
    color: colors.ink,
    flex: 1,
    paddingRight: 8,
  },
  jobPeriod: {
    fontSize: 8.5,
    color: colors.muted,
  },
  jobCompany: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 8.8,
    color: colors.accent,
    marginBottom: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  bulletMark: {
    width: 10,
    fontSize: 9,
    color: colors.bullet,
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    color: colors.bullet,
    lineHeight: 1.42,
  },
  techLine: {
    fontFamily: 'Helvetica-Oblique',
    fontSize: 8.1,
    color: colors.muted,
    marginTop: 2,
  },
  // —— Projects ——
  projectCard: {
    backgroundColor: colors.sidebarBg,
    borderWidth: 0.85,
    borderColor: colors.rule,
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  projectTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9.6,
    color: colors.ink,
    flex: 1,
    paddingRight: 8,
  },
  projectTag: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 7.8,
    color: colors.accent,
  },
  projectDetail: {
    fontSize: 8.7,
    color: colors.bullet,
    lineHeight: 1.4,
    marginTop: 2,
  },
  // —— Footer ——
  footer: {
    position: 'absolute',
    left: RIGHT_X,
    right: 595.28 - CONTENT_RIGHT,
    bottom: 24,
    borderTopWidth: 0.7,
    borderTopColor: colors.rule,
    paddingTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 7.8,
    color: colors.footer,
  },
});

function formatPageLabel(template: string, current: number, total: number) {
  return template.replace('{current}', String(current)).replace('{total}', String(total));
}

function SideSectionTitle({ children }: { children: string }) {
  return (
    <View>
      <T style={styles.sideSectionTitle}>{children}</T>
      <View style={styles.sideRule} />
    </View>
  );
}

function MainSectionTitle({ children }: { children: string }) {
  return (
    <View>
      <T style={styles.mainSectionTitle}>{children}</T>
      <View style={styles.mainRule} />
    </View>
  );
}

function JobBlock({ job, showLine }: { job: CvJob; showLine: boolean }) {
  return (
    <View style={styles.job} wrap={false}>
      <View style={styles.timelineDot} />
      {showLine ? <View style={styles.timelineLine} /> : null}
      <View style={styles.jobHeader}>
        <T style={styles.jobRole}>{job.role}</T>
        <T style={styles.jobPeriod}>{job.period}</T>
      </View>
      <T style={styles.jobCompany}>
        {job.company}
        {job.location ? `  ·  ${job.location}` : ''}
      </T>
      {job.bullets.map((bullet) => (
        <View key={bullet.slice(0, 48)} style={styles.bulletRow}>
          <T style={styles.bulletMark}>•</T>
          <T style={styles.bulletText}>{bullet}</T>
        </View>
      ))}
      <T style={styles.techLine}>{job.technologies}</T>
    </View>
  );
}

function PageFooter({ content }: { content: CvContent }) {
  return (
    <View style={styles.footer} fixed>
      <T style={styles.footerText}>
        {content.name}  ·  {content.role}
      </T>
      <T
        style={styles.footerText}
        render={({ pageNumber, totalPages }) =>
          formatPageLabel(content.sectionLabels.pageOf, pageNumber, totalPages)
        }
      />
    </View>
  );
}

interface CvDocumentProps {
  content: CvContent;
}

export default function CvDocument({ content }: CvDocumentProps) {
  const page1Jobs = content.experience.slice(0, 2);
  const page2Jobs = content.experience.slice(2);
  const isEs = content.sectionLabels.summary.startsWith('PERFIL');

  return (
    <Document
      title={`${content.name} — CV`}
      author={content.name}
      subject={content.role}
      language={isEs ? 'es' : 'en'}
    >
      {/* ───────── PAGE 1 ───────── */}
      <Page size="A4" style={styles.page}>
        <View style={styles.headerAccent} />
        <View style={styles.header}>
          <View style={styles.headerTextCol}>
            <T style={styles.name}>{content.name}</T>
            <T style={styles.roleHeader}>{content.roleHeader}</T>
            <T style={styles.headerContact}>
              {content.location}
              {'   |   '}
              <Link src={`mailto:${content.email}`} style={styles.headerContactLink}>
                {content.email}
              </Link>
            </T>
            <T style={styles.headerContact}>
              {content.phone}
              {'   |   '}
              <Link src={content.linkedinUrl} style={styles.headerContactLink}>
                {content.linkedin}
              </Link>
            </T>
          </View>
          <View style={styles.photoWrap}>
            <Image src={getCvProfileSrc()} style={styles.photo} />
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.sidebar}>
            <SideSectionTitle>{content.sectionLabels.impact}</SideSectionTitle>
            {content.impact.map((stat) => (
              <View key={stat.value} style={styles.impactBlock} wrap={false}>
                <T style={styles.impactValue}>{stat.value}</T>
                <T style={styles.impactTitle}>{stat.title}</T>
                <T style={styles.impactDetail}>{stat.detail}</T>
              </View>
            ))}

            <View style={{ marginTop: 8 }} wrap={false}>
              <SideSectionTitle>{content.sectionLabels.skills}</SideSectionTitle>
              {content.skillGroups.map((group) => (
                <View key={group.label} style={styles.skillGroup}>
                  <T style={styles.skillLabel}>{group.label}</T>
                  <T style={styles.skillValues}>{group.skills.join(' · ')}</T>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.main}>
            <MainSectionTitle>{content.sectionLabels.summary}</MainSectionTitle>
            <T style={styles.summary}>{content.summary}</T>

            <MainSectionTitle>{content.sectionLabels.experience}</MainSectionTitle>
            {page1Jobs.map((job, index) => (
              <JobBlock
                key={`${job.company}-${job.period}`}
                job={job}
                showLine={index < page1Jobs.length - 1}
              />
            ))}
          </View>
        </View>

        <PageFooter content={content} />
      </Page>

      {/* ───────── PAGE 2 ───────── */}
      <Page size="A4" style={styles.page}>
        <View style={styles.headerCompactAccent} />
        <View style={styles.headerCompact}>
          <View style={styles.headerCompactLeft}>
            <T style={styles.nameCompact}>{content.name}</T>
            <T style={styles.roleCompact}>
              {'   ·   '}
              {content.role}
            </T>
          </View>
          <T style={styles.headerCompactContact}>
            {content.email}
            {'  ·  '}
            {content.phone}
          </T>
        </View>

        <View style={styles.body}>
          <View style={styles.sidebar}>
            <SideSectionTitle>{content.sectionLabels.education}</SideSectionTitle>
            <T style={styles.eduDegree}>{content.education.degree}</T>
            <T style={styles.eduPeriod}>{content.education.period}</T>
            <T style={styles.eduInstitution}>{content.education.institution}</T>
            <T style={styles.eduDetail}>{content.education.detail}</T>

            <View style={{ marginTop: 22 }}>
              <SideSectionTitle>{content.sectionLabels.languages}</SideSectionTitle>
            </View>
            {content.languages.map((lang) => (
              <View key={lang.name} style={styles.langRow}>
                <T style={styles.langName}>{lang.name}</T>
                <T style={styles.langLevel}>{lang.level}</T>
              </View>
            ))}

            <View style={{ marginTop: 18 }}>
              <SideSectionTitle>{content.sectionLabels.contact}</SideSectionTitle>
            </View>
            <T style={styles.contactLabel}>{content.sectionLabels.contactLocation}</T>
            <T style={styles.contactValue}>{content.location}</T>
            <T style={styles.contactLabel}>{content.sectionLabels.contactEmail}</T>
            <Link src={`mailto:${content.email}`} style={styles.contactLink}>
              {content.email}
            </Link>
            <T style={styles.contactLabel}>{content.sectionLabels.contactPhone}</T>
            <T style={styles.contactValue}>{content.phone}</T>
            <T style={styles.contactLabel}>{content.sectionLabels.contactLinkedin}</T>
            <Link src={content.linkedinUrl} style={styles.contactLink}>
              {content.linkedin}
            </Link>
          </View>

          <View style={styles.main}>
            <MainSectionTitle>{content.sectionLabels.experienceContinued}</MainSectionTitle>
            {page2Jobs.map((job, index) => (
              <JobBlock
                key={`${job.company}-${job.period}`}
                job={job}
                showLine={index < page2Jobs.length - 1}
              />
            ))}

            <View style={{ marginTop: 6 }}>
              <MainSectionTitle>{content.sectionLabels.projects}</MainSectionTitle>
            </View>
            {content.projects.map((project) => (
              <View key={project.title} style={styles.projectCard} wrap={false}>
                <View style={styles.projectHeader}>
                  <T style={styles.projectTitle}>{project.title}</T>
                  <T style={styles.projectTag}>{project.tag}</T>
                </View>
                <T style={styles.projectDetail}>{project.detail}</T>
              </View>
            ))}
          </View>
        </View>

        <PageFooter content={content} />
      </Page>
    </Document>
  );
}
