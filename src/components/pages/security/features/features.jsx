import Container from 'components/shared/container';
import LINKS from 'constants/links';
import accessIcon from 'icons/security/access.svg';
import bugIcon from 'icons/security/bug.svg';
import chartsIcon from 'icons/security/charts.svg';
import checkPrivacyIcon from 'icons/security/check-privacy.svg';
import checkIcon from 'icons/security/check.svg';
import circuitIcon from 'icons/security/circuit.svg';
import crosshairIcon from 'icons/security/crosshair.svg';
import dataLockIcon from 'icons/security/data-lock.svg';
import dataReplaceIcon from 'icons/security/data-replace.svg';
import dataTransitIcon from 'icons/security/data-transit.svg';
import gearIcon from 'icons/security/gear.svg';
import graduationIcon from 'icons/security/graduation.svg';
import keyIcon from 'icons/security/key.svg';
import lockIcon from 'icons/security/lock.svg';
import mugIcon from 'icons/security/mug.svg';
import pcIcon from 'icons/security/pc.svg';
import policyIcon from 'icons/security/policy.svg';
import privacyCycleIcon from 'icons/security/privacy-cycle.svg';
import radarIcon from 'icons/security/radar.svg';
import restoreIcon from 'icons/security/restore.svg';
import searchIcon from 'icons/security/search.svg';
import segregationIcon from 'icons/security/segregation.svg';
import serverIcon from 'icons/security/server.svg';
import todoIcon from 'icons/security/todo.svg';
import userLockIcon from 'icons/security/user-lock.svg';
import userPrivacyIcon from 'icons/security/user-privacy.svg';
import warningIcon from 'icons/security/warning.svg';

import Slider from './slider';

const DATA = [
  {
    title: 'Cloud Infrastructure',
    items: [
      {
        title: 'Data Hosting',
        description:
          'Neon’s infrastructure runs on AWS and Azure, certified for SOC 2, ISO 27001, FedRAMP, PCI-DSS, HIPAA, and other global security standards.',
        icon: serverIcon,
      },
      {
        title: 'Data Segregation',
        description:
          'Customer data is isolated with unique IDs to prevent unauthorized access. The API enforces this through authentication in access tokens.',
        icon: segregationIcon,
      },
      {
        title: 'Physical & Environmental Security',
        description:
          'Neon personnel have no physical access to AWS or Azure data centers, which have 24/7 surveillance, biometric controls, redundancy, and audits.',
        icon: lockIcon,
      },
      {
        title: 'Access Control',
        description:
          'Production access is restricted by default, granted only when needed with least-privilege, time-limited permissions via Teleport and approval.',
        icon: accessIcon,
      },
      {
        title: 'Monitoring',
        description:
          'Neon uses Grafana to monitor cloud operations. System failures trigger alerts, notifying key personnel for immediate response and resolution.',
        icon: chartsIcon,
      },
      {
        title: 'Vendor Risk Management',
        description:
          'All vendors are assessed for security, privacy, and compliance. Those handling sensitive data must meet SOC 2.',
        icon: checkIcon,
      },
    ],
  },
  {
    title: 'Cloud Security',
    items: [
      {
        title: 'Network Vulnerability Scanning',
        description:
          'Neon performs continuous vulnerability scans on all infrastructure components. Identified vulnerabilities are triaged and remediated based on severity.',
        icon: warningIcon,
      },
      {
        title: 'Intrusion Detection & Prevention',
        description:
          'Neon monitors for unauthorized access using traffic monitoring, anomaly detection, and threat intelligence.',
        icon: crosshairIcon,
      },
      {
        title: 'Logical Access Controls',
        description:
          'Access to production systems is role-based (RBAC), requiring SSO and continuous monitoring. Access modifications require documented approval.',
        icon: userLockIcon,
      },
      {
        title: 'Security Incident Response',
        description:
          'Neon has a 24/7 incident response team following well-defined playbooks, including continuous training and annual tabletop exercises.',
        icon: userPrivacyIcon,
      },
    ],
  },
  {
    title: 'Encryption',
    items: [
      {
        title: 'Data in Transit',
        description:
          'Neon enforces TLS 1.2+ encryption for all data transmitted over public and private networks.',
        icon: dataTransitIcon,
      },
      {
        title: 'Data at Rest',
        description:
          'All stored data is encrypted using AES-256 and follows key rotation policies to maintain security.',
        icon: dataLockIcon,
      },
      {
        title: 'Key Management',
        description:
          'Neon uses AWS KMS and Azure Key Vault for key management, with logging and access controls.',
        icon: keyIcon,
      },
    ],
  },
  {
    title: 'Availability & Continuity',
    items: [
      {
        title: 'Redundancy',
        description:
          'Neon’s infrastructure is designed for high availability, leveraging multi-region failover and automated scaling.',
        icon: dataReplaceIcon,
      },
      {
        title: 'Backup Management',
        description:
          'Neon performs daily encrypted backups stored across multiple availability zones, with automated integrity validation.',
        icon: restoreIcon,
      },
      {
        title: 'Business Continuity and Disaster Recovery',
        description:
          'Neon has a BCDR plan with annual disaster recovery tests and predefined restoration protocols to ensure resilience.',
        icon: gearIcon,
      },
    ],
  },
  {
    title: 'Application & Platform Security',
    items: [
      {
        title: 'Bug Bounty Program',
        description:
          'Neon runs a program via HackerOne, where verified researchers can securely report vulnerabilities and earn rewards for eligible findings.',
        link: LINKS.bugBounty,
        icon: bugIcon,
      },
      {
        title: 'Secure Development Lifecycle (SDLC)',
        description:
          'Neon follows a secure development lifecycle with security testing, code reviews, dependency monitoring, and developer security training.',
        icon: privacyCycleIcon,
      },
      {
        title: 'Vulnerability Management',
        description:
          'Neon scans for vulnerabilities with Orca and Oligo, patching per SLA: critical 7 days, high 30, medium 60, low 90.',
        icon: checkPrivacyIcon,
      },
      {
        title: 'Penetration Testing',
        description:
          'Annual third-party penetration tests are conducted on our infrastructure, applications, and APIs to identify and mitigate risks.',
        icon: mugIcon,
      },
      {
        title: 'CI/CD Security',
        description:
          'Neon uses Step Security’s Harden Runner to secure CI/CD by restricting traffic, monitoring dependencies, and enforcing security policies.',
        icon: circuitIcon,
      },
      {
        title: 'GitHub Secret Scanning Partner Program',
        description:
          'Neon joined the GitHub Secret Scanning Partnership in to improve secret detection and remediation across repositories.',
        icon: radarIcon,
      },
    ],
  },
  {
    title: 'Human Resources & Endpoint Security',
    items: [
      {
        title: 'Background Checks',
        description: 'Neon conducts reference checks for all employees before onboarding.',
        icon: searchIcon,
      },
      {
        title: 'Confidentiality Agreements',
        description:
          'All employees and contractors sign non-disclosure agreements (NDA) upon hire.',
        icon: todoIcon,
      },
      {
        title: 'Policies',
        description:
          'Neon maintains a security policy framework, reviewed annually and enforced company-wide. Employees are required to acknowledge and comply with these policies each year.',
        icon: policyIcon,
      },
      {
        title: 'Training and Awareness',
        description:
          'Neon conducts annual security awareness training, covering HIPAA compliance, anti-harassment policies, and phishing simulations to strengthen employee resilience.',
        icon: graduationIcon,
      },
      {
        title: 'Endpoints',
        description:
          'Neon centrally manages employee devices via JumpCloud MDM, enforcing full-disk encryption, automatic OS updates, enforced screen locks, anti-malware protection, and continuous monitoring.',
        icon: pcIcon,
      },
    ],
  },
];

const Features = () => (
  <section className="features safe-paddings relative overflow-hidden pt-[168px] xl:pt-[136px] lg:pt-[120px] md:pt-[104px]">
    <Container className="relative z-10" size="960">
      <h2 className="sr-only">Features</h2>
      <div className="flex flex-col gap-[136px] xl:gap-[104px] lg:gap-16">
        {DATA.map((item, index) => (
          <Slider key={index} {...item} />
        ))}
      </div>
    </Container>
  </section>
);

export default Features;
