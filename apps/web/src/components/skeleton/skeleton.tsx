import styles from "./skeleton.module.css";

interface ISkeletonProps {
  className?: string;
}

const Skeleton = ({ className = "" }: ISkeletonProps) => {
  return <div className={`${styles.skeleton} ${className}`}></div>;
};

export default Skeleton;
