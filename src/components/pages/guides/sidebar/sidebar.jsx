import InkeepTrigger from 'components/shared/inkeep-trigger/inkeep-trigger';

const Sidebar = () => (
  <aside className="col-span-2 pb-10 lt:col-span-3 lg:hidden">
    <div className="relative flex h-full flex-col">
      <div className="relative flex-1">
        <nav className="no-scrollbars sticky top-32">
          <InkeepTrigger className="max-w-[192px]" />
        </nav>
      </div>
    </div>
  </aside>
);

export default Sidebar;
