import CaseList from "../components/cases/CaseList";
import Layout from "../components/common/Layout";

const CasesPage = () => {
  return (
    <Layout>
      <div className="space-y-6">
        
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Cases
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            View and manage investigation cases.
          </p>
        </div>

        {/* Cases */}
        <CaseList />

      </div>
    </Layout>
  );
};

export default CasesPage;