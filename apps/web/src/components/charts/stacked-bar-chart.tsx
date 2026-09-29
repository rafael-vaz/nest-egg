import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import hexToRgba from "../../utils/hex-to-rgba";
import ChartContainer from "./chart-container";

type Key<K extends string> = {
  id: K;
  color: string;
};

type IStackedBarChartData<K extends string> = {
  name: string;
} & Record<K, number>;

interface IStackedBarChartProps<K extends string> {
  keys: readonly Key<K>[];
  data: IStackedBarChartData<K>[];
  translations?: Record<K, string>;
}

const StackedBarChart = <K extends string>({
  keys,
  data,
  translations,
}: IStackedBarChartProps<K>) => {
  return (
    <ChartContainer type="stacked-bar">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            left: -20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#9d9baf" }} />
          <YAxis tick={{ fontSize: 12, fill: "#9d9baf" }} />
          <Tooltip
            cursor={{ fill: hexToRgba("#212121", 0.6) }}
            contentStyle={{
              fontSize: "0.875rem",
              backgroundColor: "#212121",
              borderRadius: "0.625rem",
              border: "1px solid #767587",
            }}
            formatter={(value: number, name: string) => [
              new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(value),
              translations?.[name as K] ?? name,
            ]}
          />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{
              fontSize: "0.75rem",
              lineHeight: "1.8",
              marginLeft: 20,
            }}
            formatter={(value: string) => translations?.[value as K] ?? value}
          />
          {keys.map((key) => {
            return (
              <Bar
                key={key.id}
                dataKey={key.id}
                fill={key.color}
                stroke={key.color}
                strokeWidth={1}
                fillOpacity={0.2}
                barSize={14}
                activeBar={<Rectangle fill={key.color} fillOpacity={0.5} />}
              />
            );
          })}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default StackedBarChart;
