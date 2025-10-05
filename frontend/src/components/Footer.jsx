const Footer = () => {
    return (
      <footer className="bg-gray-900 text-gray-400 py-6 px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center items-center mb-6 space-x-2">
          <img src="/logo.png" alt="DataCent Logo" className="h-10 w-10" />
          <span className="text-2xl font-bold text-white">DataCent</span>
        </div>
        <p className="text-sm text-gray-400 mb-6">
          Fast. Efficient. Kinda educational.
        </p>
        <p className="text-gray-500 text-sm">&copy; 2025 DataCent. All rights reserved.</p>
      </footer>
    )
}

export default Footer;