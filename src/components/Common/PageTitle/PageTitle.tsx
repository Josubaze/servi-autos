'use client'

export const PageTitle = (props: any) => {
  return (
    <div>
      <h2 className="font-title text-2xl pt-6 px-6">{props.title}</h2>
    </div>
  );
}

export default PageTitle;