"use client";
import React from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function LineChartThree() {
  const data = [
    [1746153600000, 30.95],
    [1746240000000, 31.34],
    [1746326400000, 31.18],
    [1746412800000, 31.05],
    [1746672000000, 31.0],
    [1746758400000, 30.95],
    [1746844800000, 31.24],
    [1746931200000, 31.29],
    [1747017600000, 31.85],
    [1747276800000, 31.86],
    [1747363200000, 32.28],
    [1747449600000, 32.1],
    [1747536000000, 32.65],
    [1747622400000, 32.21],
    [1747881600000, 32.35],
    [1747968000000, 32.44],
    [1748054400000, 32.46],
    [1748140800000, 32.86],
    [1748227200000, 32.75],
    [1748572800000, 32.54],
    [1748659200000, 32.33],
    [1748745600000, 32.97],
    [1748832000000, 33.41],
    [1749091200000, 33.27],
    [1749177600000, 33.27],
    [1749264000000, 32.89],
    [1749350400000, 33.1],
    [1749436800000, 33.73],
    [1749696000000, 33.22],
    [1749782400000, 31.99],
    [1749868800000, 32.41],
    [1749955200000, 33.05],
    [1750041600000, 33.64],
    [1750300800000, 33.56],
    [1750387200000, 34.22],
    [1750473600000, 33.77],
    [1750560000000, 34.17],
    [1750646400000, 33.82],
    [1750905600000, 34.51],
    [1750992000000, 33.16],
    [1751078400000, 33.56],
    [1751164800000, 33.71],
    [1751251200000, 33.81],
    [1751506800000, 34.4],
    [1751593200000, 34.63],
    [1751679600000, 34.46],
    [1751766000000, 34.48],
    [1751852400000, 34.31],
    [1752111600000, 34.7],
    [1752198000000, 34.31],
    [1752284400000, 33.46],
    [1752370800000, 33.59],
    [1752716400000, 33.22],
    [1752802800000, 32.61],
    [1752889200000, 33.01],
    [1752975600000, 33.55],
    [1753062000000, 33.18],
    [1753321200000, 32.84],
    [1753407600000, 33.84],
    [1753494000000, 33.39],
    [1753580400000, 32.91],
    [1753666800000, 33.06],
    [1753926000000, 32.62],
    [1754012400000, 32.4],
    [1754098800000, 33.13],
    [1754185200000, 33.26],
    [1754271600000, 33.58],
    [1754530800000, 33.55],
    [1754617200000, 33.77],
    [1754703600000, 33.76],
    [1754790000000, 33.32],
    [1754876400000, 32.61],
    [1755135600000, 32.52],
    [1755222000000, 32.67],
    [1755308400000, 32.52],
    [1755394800000, 31.92],
    [1755481200000, 32.2],
    [1755740400000, 32.23],
    [1755826800000, 32.33],
    [1755913200000, 32.36],
    [1755999600000, 32.01],
    [1756086000000, 31.31],
    [1756345200000, 32.01],
    [1756431600000, 32.01],
    [1756518000000, 32.18],
    [1756604400000, 31.54],
    [1756690800000, 31.6],
    [1757036400000, 32.05],
    [1757122800000, 31.29],
    [1757209200000, 31.05],
    [1757295600000, 29.82],
    [1757554800000, 30.31],
    [1757641200000, 30.7],
    [1757727600000, 31.69],
    [1757814000000, 31.32],
    [1757900400000, 31.65],
    [1758159600000, 31.13],
    [1758246000000, 31.77],
    [1758332400000, 31.79],
    [1758418800000, 31.67],
    [1758505200000, 32.39],
    [1758764400000, 32.63],
    [1758850800000, 32.89],
    [1758937200000, 31.99],
    [1759023600000, 31.23],
    [1759110000000, 31.57],
    [1759369200000, 30.84],
    [1759455600000, 31.07],
    [1759542000000, 31.41],
    [1759628400000, 31.17],
    [1759714800000, 32.37],
    [1759974000000, 32.19],
    [1760060400000, 32.51],
    [1760233200000, 32.53],
    [1760319600000, 31.37],
    [1760578800000, 30.43],
    [1760665200000, 30.44],
    [1760751600000, 30.2],
    [1760838000000, 30.14],
    [1760924400000, 30.65],
    [1761183600000, 30.4],
    [1761270000000, 30.65],
    [1761356400000, 31.43],
    [1761442800000, 31.89],
    [1761529200000, 31.38],
    [1761788400000, 30.64],
    [1761874800000, 30.02],
    [1761961200000, 30.33],
    [1762047600000, 30.95],
    [1762134000000, 31.89],
    [1762393200000, 31.01],
    [1762479600000, 30.88],
    [1762566000000, 30.69],
    [1762652400000, 30.58],
    [1762738800000, 32.02],
    [1762998000000, 32.14],
    [1763084400000, 32.37],
    [1763170800000, 32.51],
    [1763257200000, 32.65],
    [1763343600000, 32.64],
    [1763602800000, 32.27],
    [1763689200000, 32.1],
    [1763775600000, 32.91],
    [1763862000000, 33.65],
    [1763948400000, 33.8],
    [1764207600000, 33.92],
    [1764294000000, 33.75],
    [1764380400000, 33.84],
    [1764466800000, 33.5],
    [1764553200000, 32.26],
    [1764812400000, 32.32],
    [1764898800000, 32.06],
    [1764985200000, 31.96],
    [1765071600000, 31.46],
    [1765158000000, 31.27],
    [1765503600000, 31.43],
    [1765590000000, 32.26],
    [1765676400000, 32.79],
    [1765762800000, 32.46],
    [1766022000000, 32.13],
    [1766108400000, 32.43],
    [1766194800000, 32.42],
    [1766281200000, 32.81],
    [1766367600000, 33.34],
    [1766626800000, 33.41],
    [1766713200000, 32.57],
    [1766799600000, 33.12],
    [1766886000000, 34.53],
    [1766972400000, 33.83],
    [1767231600000, 33.41],
    [1767318000000, 32.9],
    [1767404400000, 32.53],
    [1767490800000, 32.8],
    [1767577200000, 32.44],
    [1767836400000, 32.62],
    [1767922800000, 32.57],
    [1768009200000, 32.6],
    [1768095600000, 32.68],
    [1768182000000, 32.47],
    [1768441200000, 32.23],
    [1768527600000, 31.68],
    [1768614000000, 31.51],
    [1768700400000, 31.78],
    [1768786800000, 31.94],
    [1769046000000, 32.33],
    [1769132400000, 33.24],
    [1769218800000, 33.44],
    [1769305200000, 33.48],
    [1769391600000, 33.24],
    [1769650800000, 33.49],
    [1769737200000, 33.31],
    [1769823600000, 33.36],
    [1769910000000, 33.4],
    [1769996400000, 34.01],
    [1770432000000, 34.02],
    [1770518400000, 34.36],
    [1770604800000, 34.39],
    [1770864000000, 34.24],
    [1770950400000, 34.39],
    [1771036800000, 33.47],
    [1771123200000, 32.98],
    [1771209600000, 32.9],
    [1771468800000, 32.7],
    [1771555200000, 32.54],
    [1771641600000, 32.23],
    [1771728000000, 32.64],
    [1771814400000, 32.65],
    [1772073600000, 32.92],
    [1772160000000, 32.64],
    [1772246400000, 32.84],
    [1772419200000, 33.4],
    [1772678400000, 33.3],
    [1772764800000, 33.18],
    [1772851200000, 33.88],
    [1772937600000, 34.09],
    [1773024000000, 34.61],
    [1773283200000, 34.7],
    [1773369600000, 35.3],
    [1773456000000, 35.4],
    [1773542400000, 35.14],
    [1773628800000, 35.48],
    [1773888000000, 35.75],
    [1773974400000, 35.54],
    [1774060800000, 35.96],
    [1774147200000, 35.53],
    [1774233600000, 37.56],
    [1774492800000, 37.42],
    [1774579200000, 37.49],
    [1774665600000, 38.09],
    [1774752000000, 37.87],
  ];
  const options: ApexOptions = {
    legend: {
      show: false,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 335,
      id: "area-datetime",
      type: "area",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "straight",
      width: [1], // Fixed width array
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
    },
    xaxis: {
      type: "datetime",
      tickAmount: 10,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tooltip: {
        enabled: false, // Changed to correct property
      },
    },
    tooltip: {
      x: {
        format: "dd MMM yyyy",
      },
    },
    fill: {
      type: "gradient", // Explicitly set the type for gradient
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    yaxis: {
      title: {
        text: "", // Ensure no title text
        style: {
          fontSize: "0px", // Correct style application
        },
      },
    },
  };

  const series = [
    {
      name: "Portfolio Performance",
      data: data,
    },
  ];
  return (
    <div className="max-w-full overflow-x-auto custom-scrollbar">
      <div id="chartEight" className="min-w-[1000px] xl:min-w-full">
        <ReactApexChart options={options} series={series} type="area" height={335} />
      </div>
    </div>
  );
}
