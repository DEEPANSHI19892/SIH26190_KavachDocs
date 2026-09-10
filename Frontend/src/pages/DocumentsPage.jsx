import Layout from "../components/common/Layout";
import DocumentList from "../components/documents/DocumentList";
import DocumentUpload from "../components/documents/DocumentUpload";

const DocumentsPage = () => {
  return (
    <Layout>

      <div className="space-y-8">

        <DocumentList />

        <DocumentUpload />

      </div>

    </Layout>
  );
};

export default DocumentsPage;