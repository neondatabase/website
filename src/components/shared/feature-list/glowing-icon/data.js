import AgentCreates from 'icons/features-icon/agent-creates.inline.svg';
import AgentsAdds from 'icons/features-icon/agents-adds.inline.svg';
import Branching from 'icons/features-icon/branching.inline.svg';
import Database from 'icons/features-icon/database.inline.svg';
import GetsWorking from 'icons/features-icon/gets-working.inline.svg';
import InfraStays from 'icons/features-icon/infra-stays.inline.svg';
import Transactions from 'icons/features-icon/transactions.inline.svg';

export const FEATURES = [
  {
    id: 'agent-creates',
    icon: <AgentCreates className="w-full" />,
    title: 'Agent creates an app',
    description:
      'A vibe coder imagines an app. Your agent builds it, full-stack. Real apps need databases, not just UI scaffolds or code snippets. Neon lets your agent add a fully functional Postgres database to every app it builds. Whether they’re prototyping, testing, or deploying, your users get persistence out of the box.',
  },
  {
    id: 'instant-db',
    icon: <GetsWorking className="w-full" />,
    title: 'Gets a working database instantly, with no friction',
    description:
      'Neon provisions the database behind the scenes via API, so your user never has to leave your flow or sign up for an external service. Provisioning is instant, invisible, and integrated. Your agent simply requests a project, and Neon returns a live Postgres instance. The result is a seamless experience where databases just show up, and the vibe never breaks.',
  },
  {
    id: 'adds-auth',
    icon: <AgentsAdds className="w-full" />,
    title: 'Agent adds auth',
    description:
      'Neon makes it easy to add secure, production-ready authentication and access control to agent-generated apps using Neon Auth. Your users don’t have to wire it up themselves – auth just works, right out of the box. One less thing to worry about, and one more reason their app feels real.',
  },
  {
    id: 'infra-affordable',
    icon: <InfraStays className="w-full" />,
    title: 'Infra stays affordable as more apps are created',
    description:
      'Imagine spinning up a new RDS instance every few seconds: you’d blow your budget on the first invoice. Most managed databases aren’t built to support thousands of isolated instances, especially not cheaply. Neon’s serverless architecture solves this. Databases automatically scale to zero when idle and wake up instantly. You don’t pay unless the database is active or stores data.',
  },
  {
    id: 'branching',
    icon: <Branching className="w-full" />,
    title: 'Branching unlocks time travel + safety',
    description:
      'Neon branching makes it easy to build full-version history into your platform. Your agent can snapshot schema and data at any moment, and vibe coders can roll back to a working version of their app, preview earlier states, or safely test changes.',
  },
  {
    id: 'quotas',
    icon: <Transactions className="w-full" />,
    title: 'Stay in control with quotas',
    description:
      'The Neon API allows you to track usage per project and branch with detailed endpoints for compute time, storage, and network I/O. You can enforce quotas via the API to match your free or paid plans, giving you full control over how resources are consumed.',
  },
  {
    id: 'just-postgres',
    icon: <Database className="w-full" />,
    title: "It's all just Postgres",
    description:
      'The Neon API allows you to tracks usage per project and branch with detailed endpoints for compute time, storage, and network I/O. You can enforce quotas via the API to match your free or paid plans, giving you full control over how resources are consumed.',
  },
];

export const FEATURES_TOC = FEATURES.map(({ title }) => ({
  title,
  level: 3,
}));
