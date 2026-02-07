      {isFeatureActive('service_chat') && (
        <section className="py-6 border-t border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
          <div className="px-5 mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-none">Receba até 5 orçamentos gratuitos</h2>
          </div>
          <div className="px-5">
            <FifaBanner onClick={() => setWizardStep(1)} />
          </div>
        </section>
      )}