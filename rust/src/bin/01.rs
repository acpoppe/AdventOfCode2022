advent_of_code::solution!(1);

pub fn part_one(input: &str) -> Option<u32> {
    let parts = input.trim().split("\n\n");
    let mut max_cals: u32 = 0;
    for part in parts {
        let items = part.split("\n");
        let mut total_cals: u32 = 0;
        for item in items {
            let cals: u32 = item.trim().parse().expect("Failed to parse item");
            total_cals += cals;
        }
        if total_cals > max_cals {
            max_cals = total_cals;
        }
    }
    Some(max_cals)
}

pub fn part_two(input: &str) -> Option<u32> {
    let parts = input.trim().split("\n\n");
    let mut totals: Vec<u32> = Vec::new();
    for part in parts {
        let items = part.split("\n");
        let mut total_cals: u32 = 0;
        for item in items {
            let cals: u32 = item.trim().parse().expect("Failed to parse item");
            total_cals += cals;
        }
        totals.push(total_cals);
    }
    totals.sort();
    totals.reverse();
    Some(totals[0] + totals[1] + totals[2])
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_part_one() {
        let result = part_one(&advent_of_code::template::read_file("examples", DAY));
        assert_eq!(result, Some(24000));
    }

    #[test]
    fn test_part_two() {
        let result = part_two(&advent_of_code::template::read_file("examples", DAY));
        assert_eq!(result, Some(45000));
    }
}
