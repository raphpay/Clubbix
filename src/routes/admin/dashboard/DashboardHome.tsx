import Card from "../../../components/Card";
import Section from "../../../components/Section";

const DashboardHome = () => {
  return (
    <div className="space-y-8">
      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="Active Members" value="152" />
        <Card title="Upcoming Events" value="3" />
        <Card title="Monthly Revenue" value="€1,250" />
      </div>

      {/* Three Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Events */}
        <Section title="Upcoming Events">
          {/* Replace with map of real data */}
          <p>No events scheduled today.</p>
        </Section>

        {/* Recent Activity */}
        <Section title="Recent Activity">
          <ul className="list-disc pl-5 text-gray-600">
            <li>John Doe paid €50 membership fee</li>
            <li>Event "Training Camp" created</li>
          </ul>
        </Section>

        {/* Finance Summary */}
        <Section title="Finance Summary">
          <p>Total Income: €3,200</p>
          <p>Total Expenses: €1,950</p>
          <p>Net Profit: €1,250</p>
        </Section>
      </div>
    </div>
  );
};

export default DashboardHome;
