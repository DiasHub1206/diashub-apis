import { getManager } from 'typeorm';

export async function countUsersWithUsernamePrefixQfn(
  prefix: string,
): Promise<number> {
  const users: { count: number }[] = await getManager().query(
    `
    SELECT
      COUNT("id") "count"
    FROM
      (
        (
          SELECT
            u."id" "id"
          FROM
            user u
          WHERE
            u."username" ILIKE CONCAT($1::TEXT, '%')
        )
      ) users
  `,
    [prefix],
  );

  return users[0]?.count || 0;
}
