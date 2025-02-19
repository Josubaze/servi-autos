import Link from 'next/link';
import { NAVITEMS } from 'src/utils/constanst';
import { usePathname } from 'next/navigation';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

export const OptionsGuest: React.FC = () => {
  const pathname = usePathname();

  return (
    <div className="w-full flex justify-end space-x-4">
      {NAVITEMS.map((item) => {
        return (
          <Link
            key={item.name}
            href={item.href}
            className={classNames(
              'hover:bg-indigo-700 rounded-md px-3 py-2 text-sm font-medium',
              pathname === item.href ? 'bg-indigo-700' : ''
            )}
          >
            {item.name}
          </Link>
        );
      })}
    </div>
  );
};

