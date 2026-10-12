import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import ChartContainer, { ContainerHeight } from "./chart-container";

interface IPieChartData {
  name: string;
  value: number;
  color: string;
}

interface IPieChartComponentProps {
  data: IPieChartData[];
  height?: ContainerHeight;
}

const PieChartComponent = ({
  data,
  height = "small",
}: IPieChartComponentProps) => {
  // zero-value slices still reserve their paddingAngle gap, leaving a
  // visible gap in the ring when only some categories have entries
  const visibleData = data.filter((entry) => entry.value > 0);

  return (
    <ChartContainer type="pie" height={height}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={visibleData}
            cx={40}
            cy="50%"
            innerRadius="60%"
            outerRadius="80%"
            paddingAngle={visibleData.length > 1 ? 4 : 0}
            dataKey="value"
            nameKey="name"
          >
            {visibleData.map((entry) => (
              <Cell
                key={`cell-${entry.name}`}
                fill={entry.color}
                stroke={entry.color}
              />
            ))}
          </Pie>
          <Legend
            layout="vertical"
            verticalAlign="middle"
            align="center"
            wrapperStyle={{
              fontSize: "0.75rem",
              lineHeight: "1.8",
              left: 0,
              paddingLeft: "110px",
            }}
          />
          <Tooltip
            contentStyle={{
              fontSize: "0.875rem",
              backgroundColor: "#212121",
              borderRadius: "0.625rem",
              border: "1px solid #767587",
            }}
            itemStyle={{ color: "#dedde9" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default PieChartComponent;
