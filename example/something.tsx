import SomeDefaultImport, { AwesomeStuff, CoolStuff } from '@scoped/package';
import coolApi, { apiD } from 'bla';

export const Comp = () => {
  const data = apiD();

  coolApi.run();

  return (
    <>
      <AwesomeStuff first={1} second="2" />
      <CoolStuff first={2} second="4" />
      <CoolStuff second="4" />
      <SomeDefaultImport first={1} second="2" third={data}></SomeDefaultImport>
      <SomeDefaultImport first={1} third="3" forth={data}></SomeDefaultImport>
      <SomeDefaultImport second={1}></SomeDefaultImport>
    </>
  );
};
