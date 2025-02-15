import Link from 'next/link';
import { NAVITEMS } from 'src/utils/constanst';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

export const OptionsGuest: React.FC = () => {
  return (
    <div className="w-full flex justify-end space-x-4">
      {NAVITEMS.map((item) => {
        return (
          <Link
            key={item.name}
            href={item.href}
            className={classNames(
              'hover:bg-indigo-700 rounded-md px-3 py-2 text-sm font-medium'
            )}
          >
            {item.name}
          </Link>
        );
      })}
    </div>
  );
};

export default OptionsGuest;
