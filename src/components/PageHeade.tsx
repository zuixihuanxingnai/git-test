import '@/styles/admin/pagehead.scss'

const PageHeade = ({ title, children }: { title: string; children?: React.ReactNode }) => {
  return (
    <div className="page-head">
      <p className="page-title">{title}</p>
      <div className="action-btn">{children}</div>
    </div>
  )
}

export default PageHeade