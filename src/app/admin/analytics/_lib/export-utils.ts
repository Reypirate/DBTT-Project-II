import { MOCK_INVENTORY } from "@/data/products";
import {
  revenueData,
  proxyCapacityData,
  propensityData,
  cartGapData,
  geographicData,
} from "../_components/analytics-data";

export const handleExportCSV = () => {
  // Inventory Velocity Block
  const invHeaders = ["Inventory Tracker", "", "", "", "", "", ""];
  const invCols = [
    "ID",
    "Product Name",
    "Category",
    "Stock",
    "Velocity (Wk)",
    "Demand Trend",
    "Projected Demand (%)",
  ];
  const invRows = MOCK_INVENTORY.sort((a, b) => b.velocity - a.velocity).map((item) => [
    item.id,
    `"${item.name.replace(/"/g, '""')}"`,
    `"${item.category.replace(/"/g, '""')}"`,
    item.stock,
    item.velocity,
    item.trend,
    item.projectedDemand,
  ]);

  // Revenue Trends Block
  const revHeaders = ["Annual Revenue & Orders", "", "", ""];
  const revCols = ["Month", "Revenue", "Orders", "Festival Peak"];
  const revRows = revenueData.map((data) => [
    data.month,
    data.revenue,
    data.orders,
    data.festivalPeak || "None",
  ]);

  // Proxy Capacity Block
  const capHeaders = ["Proxy Capacity Forecasting", "", ""];
  const capCols = ["Date", "Projected Requests", "Capacity Limit"];
  const capRows = proxyCapacityData.map((data) => [
    data.date,
    data.projectedRequests,
    data.capacityLimit,
  ]);

  // Propensity Block
  const propHeaders = ["Membership Propensity", "", "", ""];
  const propCols = ["Cohort", "Frequency", "Users", "Probability (%)"];
  const propRows = propensityData.map((data) => [
    data.cohort,
    data.frequency,
    data.users,
    data.probability,
  ]);

  // Cart Gaps Block
  const gapsHeaders = ["Cultural Cart-Gaps", "", "", "", ""];
  const gapsCols = [
    "Dialect Group",
    "Base Product",
    "Missing Product",
    "Affected Orders",
    "Potential Revenue",
  ];
  const gapsRows = cartGapData.map((data) => [
    data.dialectGroup,
    `"${data.baseProduct}"`,
    `"${data.missingProduct}"`,
    data.affectedOrders,
    data.potentialRevenue,
  ]);

  // Geographic Block
  const geoHeaders = ["Geographic Analytics", "", "", ""];
  const geoCols = ["Segment", "Total Customers", "Avg Order Value (S$)", "Retention Rate (%)"];
  const geoRows = geographicData.map((data) => [
    `"${data.segment}"`,
    data.totalCustomers,
    data.avgOrderValue,
    data.retentionRate,
  ]);

  const csvContent = [
    invHeaders.join(","),
    invCols.join(","),
    ...invRows.map((r) => r.join(",")),
    "",
    revHeaders.join(","),
    revCols.join(","),
    ...revRows.map((r) => r.join(",")),
    "",
    capHeaders.join(","),
    capCols.join(","),
    ...capRows.map((r) => r.join(",")),
    "",
    geoHeaders.join(","),
    geoCols.join(","),
    ...geoRows.map((r) => r.join(",")),
    "",
    propHeaders.join(","),
    propCols.join(","),
    ...propRows.map((r) => r.join(",")),
    "",
    gapsHeaders.join(","),
    gapsCols.join(","),
    ...gapsRows.map((r) => r.join(",")),
  ];

  const blob = new Blob([csvContent.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute(
    "download",
    `hinlong_deep_analytics_${new Date().toISOString().split("T")[0]}.csv`,
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
