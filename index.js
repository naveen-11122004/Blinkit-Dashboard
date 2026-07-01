// Blinkit Sales Dashboard Application Logic

document.addEventListener('DOMContentLoaded', () => {
  // 1. Data Source
  // 'blinkitData' is loaded globally from data.js
  const rawRecords = blinkitData.raw_records;
  
  // 2. Chart References
  let chartEstablishment = null;
  let chartFatContent = null;
  let chartOutletSize = null;
  let chartItemTypes = null;
  let chartLocationSize = null;

  // 3. Elements Selection
  const filterFatList = document.getElementById('filter-fat-content');
  const filterSizeList = document.getElementById('filter-outlet-size');
  const filterLocationList = document.getElementById('filter-outlet-location');
  
  const kpiTotalSales = document.getElementById('kpi-total-sales');
  const kpiAvgSales = document.getElementById('kpi-avg-sales');
  const kpiNumItems = document.getElementById('kpi-num-items');
  const kpiAvgRating = document.getElementById('kpi-avg-rating');
  const recordsCountLabel = document.getElementById('records-count');
  
  const resetFiltersBtn = document.getElementById('reset-filters');
  const tableBody = document.querySelector('#outlet-type-table tbody');

  // Chart Global Styling Options for Dark Theme
  Chart.defaults.color = '#8e9dbd';
  Chart.defaults.font.family = "'Inter', sans-serif";

  // Helper to format currency
  function formatCurrency(val) {
    if (val >= 1000000) {
      return `$${(val / 1000000).toFixed(2)}M`;
    }
    return `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  // Helper to format integers
  function formatInteger(val) {
    return val.toLocaleString();
  }

  // 4. Filtering Logic
  function getSelectedFilters() {
    const fatFilters = Array.from(filterFatList.querySelectorAll('input:checked')).map(el => el.value);
    const sizeFilters = Array.from(filterSizeList.querySelectorAll('input:checked')).map(el => el.value);
    const locationFilters = Array.from(filterLocationList.querySelectorAll('input:checked')).map(el => el.value);
    
    return { fatFilters, sizeFilters, locationFilters };
  }

  function filterData(records, filters) {
    return records.filter(r => {
      // Fat Content Match
      const matchesFat = filters.fatFilters.includes(r['Item Fat Content']);
      
      // Outlet Size Match (Excel file contains Small, Medium, High. Check if null or empty)
      const sizeVal = r['Outlet Size'] || 'Unknown';
      const matchesSize = filters.sizeFilters.includes(sizeVal);
      
      // Outlet Location Match
      const matchesLocation = filters.locationFilters.includes(r['Outlet Location Type']);
      
      return matchesFat && matchesSize && matchesLocation;
    });
  }

  // 5. Aggregate Calculations & KPI Updates
  function updateDashboard() {
    const filters = getSelectedFilters();
    const filtered = filterData(rawRecords, filters);
    
    // Total Count
    recordsCountLabel.textContent = formatInteger(filtered.length);
    
    if (filtered.length === 0) {
      // Empty state
      kpiTotalSales.textContent = "$0.00";
      kpiAvgSales.textContent = "$0.00";
      kpiNumItems.textContent = "0";
      kpiAvgRating.textContent = "0.00";
      
      clearCharts();
      tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">No records match selected filters.</td></tr>`;
      return;
    }
    
    // KPI calculations
    let totalSalesVal = 0;
    let totalRatingVal = 0;
    let ratedItemsCount = 0;
    
    filtered.forEach(r => {
      totalSalesVal += r.Sales;
      if (r.Rating !== null && r.Rating !== undefined) {
        totalRatingVal += r.Rating;
        ratedItemsCount++;
      }
    });
    
    const avgSalesVal = totalSalesVal / filtered.length;
    const avgRatingVal = ratedItemsCount > 0 ? (totalRatingVal / ratedItemsCount) : 0;
    
    // Write to KPIs
    kpiTotalSales.textContent = formatCurrency(totalSalesVal);
    kpiAvgSales.textContent = `$${avgSalesVal.toFixed(0)}`;
    kpiNumItems.textContent = formatInteger(filtered.length);
    kpiAvgRating.textContent = `${avgRatingVal.toFixed(2)} ★`;
    
    // Run chart updates
    renderEstablishmentChart(filtered);
    renderDonuts(filtered);
    renderItemTypesChart(filtered);
    renderLocationSizeChart(filtered);
    renderOutletTable(filtered);
  }

  // Clear charts when 0 data matches
  function clearCharts() {
    if (chartEstablishment) chartEstablishment.destroy();
    if (chartFatContent) chartFatContent.destroy();
    if (chartOutletSize) chartOutletSize.destroy();
    if (chartItemTypes) chartItemTypes.destroy();
    if (chartLocationSize) chartLocationSize.destroy();
    
    chartEstablishment = null;
    chartFatContent = null;
    chartOutletSize = null;
    chartItemTypes = null;
    chartLocationSize = null;
  }

  // 6. Chart Render Functions

  // A. Outlet Establishment Trend (Line Chart)
  function renderEstablishmentChart(data) {
    // Group sales by year
    const yearlySales = {};
    data.forEach(r => {
      const year = r['Outlet Establishment Year'];
      yearlySales[year] = (yearlySales[year] || 0) + r.Sales;
    });
    
    const years = Object.keys(yearlySales).sort();
    const sales = years.map(yr => yearlySales[yr]);
    
    const ctx = document.getElementById('chart-establishment').getContext('2d');
    
    if (chartEstablishment) {
      chartEstablishment.data.labels = years;
      chartEstablishment.data.datasets[0].data = sales;
      chartEstablishment.update();
      return;
    }
    
    const gradient = ctx.createLinearGradient(0, 0, 0, 200);
    gradient.addColorStop(0, 'rgba(0, 242, 254, 0.4)');
    gradient.addColorStop(1, 'rgba(0, 242, 254, 0)');
    
    chartEstablishment = new Chart(ctx, {
      type: 'line',
      data: {
        labels: years,
        datasets: [{
          label: 'Total Sales',
          data: sales,
          borderColor: '#00f2fe',
          borderWidth: 3,
          pointBackgroundColor: '#00f2fe',
          pointHoverRadius: 7,
          backgroundColor: gradient,
          fill: true,
          tension: 0.35
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: {
              callback: function(value) {
                return '$' + (value / 1000).toFixed(0) + 'K';
              }
            }
          }
        }
      }
    });
  }

  // B. Donuts (Fat Content and Outlet Size)
  function renderDonuts(data) {
    // 1. Fat Content
    const fatSales = { 'Low Fat': 0, 'Regular': 0 };
    data.forEach(r => {
      const fat = r['Item Fat Content'];
      if (fatSales[fat] !== undefined) {
        fatSales[fat] += r.Sales;
      }
    });
    
    const fatLabels = Object.keys(fatSales);
    const fatValues = Object.values(fatSales);
    
    if (chartFatContent) {
      chartFatContent.data.labels = fatLabels;
      chartFatContent.data.datasets[0].data = fatValues;
      chartFatContent.update();
    } else {
      const ctxFat = document.getElementById('chart-fat-content').getContext('2d');
      chartFatContent = new Chart(ctxFat, {
        type: 'doughnut',
        data: {
          labels: fatLabels,
          datasets: [{
            data: fatValues,
            backgroundColor: ['#00f2fe', '#ff007f'],
            borderColor: '#13192b',
            borderWidth: 2,
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { boxWidth: 10, padding: 8, font: { size: 9 } }
            }
          },
          cutout: '70%'
        }
      });
    }

    // 2. Outlet Size
    const sizeSales = { 'Small': 0, 'Medium': 0, 'High': 0 };
    data.forEach(r => {
      const sizeVal = r['Outlet Size'] || 'Unknown';
      if (sizeSales[sizeVal] !== undefined) {
        sizeSales[sizeVal] += r.Sales;
      }
    });
    
    const sizeLabels = Object.keys(sizeSales);
    const sizeValues = Object.values(sizeSales);
    
    if (chartOutletSize) {
      chartOutletSize.data.labels = sizeLabels;
      chartOutletSize.data.datasets[0].data = sizeValues;
      chartOutletSize.update();
    } else {
      const ctxSize = document.getElementById('chart-outlet-size').getContext('2d');
      chartOutletSize = new Chart(ctxSize, {
        type: 'doughnut',
        data: {
          labels: sizeLabels,
          datasets: [{
            data: sizeValues,
            backgroundColor: ['#4facfe', '#9b51e0', '#f2c94c'],
            borderColor: '#13192b',
            borderWidth: 2,
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { boxWidth: 10, padding: 8, font: { size: 9 } }
            }
          },
          cutout: '70%'
        }
      });
    }
  }

  // C. Item Type Sales (Horizontal Bar Chart)
  function renderItemTypesChart(data) {
    const itemSales = {};
    data.forEach(r => {
      const type = r['Item Type'];
      itemSales[type] = (itemSales[type] || 0) + r.Sales;
    });
    
    // Sort items by Sales descending
    const sortedTypes = Object.keys(itemSales).sort((a, b) => itemSales[b] - itemSales[a]);
    // Limit to top 10 for clean presentation
    const topTypes = sortedTypes.slice(0, 10);
    const topSales = topTypes.map(t => itemSales[t]);
    
    const ctx = document.getElementById('chart-item-types').getContext('2d');
    
    if (chartItemTypes) {
      chartItemTypes.data.labels = topTypes;
      chartItemTypes.data.datasets[0].data = topSales;
      chartItemTypes.update();
      return;
    }
    
    const gradient = ctx.createLinearGradient(0, 0, 400, 0);
    gradient.addColorStop(0, '#4facfe');
    gradient.addColorStop(1, '#00f2fe');
    
    chartItemTypes = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: topTypes,
        datasets: [{
          label: 'Total Sales',
          data: topSales,
          backgroundColor: gradient,
          borderRadius: 4,
          borderWidth: 0,
          barThickness: 14
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: {
              callback: function(value) {
                return '$' + (value / 1000).toFixed(0) + 'K';
              }
            }
          },
          y: {
            grid: { display: false }
          }
        }
      }
    });
  }

  // D. Outlet Location & Size Matrix (Grouped Bar Chart)
  function renderLocationSizeChart(data) {
    // Rows: Tier 1, Tier 2, Tier 3
    // Columns/Groups: Small, Medium, High
    const matrix = {
      'Tier 1': { 'Small': 0, 'Medium': 0, 'High': 0 },
      'Tier 2': { 'Small': 0, 'Medium': 0, 'High': 0 },
      'Tier 3': { 'Small': 0, 'Medium': 0, 'High': 0 }
    };
    
    data.forEach(r => {
      const tier = r['Outlet Location Type'];
      const sizeVal = r['Outlet Size'] || 'Unknown';
      if (matrix[tier] && matrix[tier][sizeVal] !== undefined) {
        matrix[tier][sizeVal] += r.Sales;
      }
    });
    
    const labels = ['Tier 1', 'Tier 2', 'Tier 3'];
    const smallSales = labels.map(lbl => matrix[lbl]['Small']);
    const mediumSales = labels.map(lbl => matrix[lbl]['Medium']);
    const highSales = labels.map(lbl => matrix[lbl]['High']);
    
    const ctx = document.getElementById('chart-location-size').getContext('2d');
    
    if (chartLocationSize) {
      chartLocationSize.data.datasets[0].data = smallSales;
      chartLocationSize.data.datasets[1].data = mediumSales;
      chartLocationSize.data.datasets[2].data = highSales;
      chartLocationSize.update();
      return;
    }
    
    chartLocationSize = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Small',
            data: smallSales,
            backgroundColor: '#4facfe',
            borderRadius: 4,
            barThickness: 12
          },
          {
            label: 'Medium',
            data: mediumSales,
            backgroundColor: '#9b51e0',
            borderRadius: 4,
            barThickness: 12
          },
          {
            label: 'High',
            data: highSales,
            backgroundColor: '#f2c94c',
            borderRadius: 4,
            barThickness: 12
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 12 } }
        },
        scales: {
          x: {
            grid: { display: false }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: {
              callback: function(value) {
                return '$' + (value / 1000).toFixed(0) + 'K';
              }
            }
          }
        }
      }
    });
  }

  // E. Outlet Type Comparison Table
  function renderOutletTable(data) {
    const summary = {};
    data.forEach(r => {
      const type = r['Outlet Type'];
      if (!summary[type]) {
        summary[type] = {
          Total_Sales: 0,
          Num_Items: 0,
          Total_Rating: 0,
          Rated_Count: 0,
          Total_Visibility: 0
        };
      }
      summary[type].Total_Sales += r.Sales;
      summary[type].Num_Items++;
      if (r.Rating !== null && r.Rating !== undefined) {
        summary[type].Total_Rating += r.Rating;
        summary[type].Rated_Count++;
      }
      if (r['Item Visibility'] !== null && r['Item Visibility'] !== undefined) {
        summary[type].Total_Visibility += r['Item Visibility'];
      }
    });
    
    let html = '';
    const types = Object.keys(summary).sort((a, b) => summary[b].Total_Sales - summary[a].Total_Sales);
    
    types.forEach(type => {
      const s = summary[type];
      const avgSales = s.Total_Sales / s.Num_Items;
      const avgRating = s.Rated_Count > 0 ? (s.Total_Rating / s.Rated_Count) : 0;
      const avgVisibility = (s.Total_Visibility / s.Num_Items) * 100; // Percentage format
      
      html += `
        <tr>
          <td>${type}</td>
          <td>${formatCurrency(s.Total_Sales)}</td>
          <td>${formatInteger(s.Num_Items)}</td>
          <td>${formatCurrency(avgSales)}</td>
          <td>${avgRating.toFixed(2)} ★</td>
          <td>${avgVisibility.toFixed(2)}%</td>
        </tr>
      `;
    });
    
    tableBody.innerHTML = html;
  }

  // 7. Event Listeners
  const checkboxes = document.querySelectorAll('.sidebar-filters input[type="checkbox"]');
  checkboxes.forEach(cb => {
    cb.addEventListener('change', updateDashboard);
  });

  resetFiltersBtn.addEventListener('click', () => {
    checkboxes.forEach(cb => {
      cb.checked = true;
    });
    updateDashboard();
  });

  // 8. Initialize Dashboard
  updateDashboard();
});
