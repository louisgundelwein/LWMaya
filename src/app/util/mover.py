import math


def get_square_coords(
    n_rows: int,
    n_cols: int,
    box_height: float,
    box_width: float,
    square_height: float,
    square_width: float,
    left_bottom_corner_x: float,
    left_bottom_corner_y: float,
) -> list[list[tuple[float, float]]]:
    thickness_space_between_squares_vert = (box_height - square_height * n_rows) / (
        n_rows + 1
    )
    thickness_space_between_squares_hor = (box_width - square_width * n_cols) / (
        n_cols + 1
    )

    assert (
        thickness_space_between_squares_vert >= 0
    ), "Square height + space between squares is greater than the height of the box"

    assert (
        thickness_space_between_squares_hor >= 0
    ), "Square width + space between squares is greater than the width of the box"

    return [
        [
            (
                left_bottom_corner_x
                + thickness_space_between_squares_hor
                + i * (square_width + thickness_space_between_squares_hor)
                + square_width / 2,
                left_bottom_corner_y
                + thickness_space_between_squares_vert
                + j * (square_height + thickness_space_between_squares_vert)
                + square_height / 2,
            )
            for i in range(n_cols)
        ]
        for j in range(n_rows)
    ]


def get_angle_to_coords(x, y) -> float:
    if x == 0:
        if y > 0:
            return 90
        elif y < 0:
            return 270
        else:
            print("x and y are both 0... Defaulting to 0 angle")
            return 0

    angle = math.degrees(math.atan(abs(y) / abs(x)))
    if y >= 0:
        if x < 0:
            return angle
        else:
            return 180 - angle
    else:
        if x < 0:
            return 360 - angle
        else:
            return 180 + angle


def get_distance_to_coords(x, y) -> float:
    return math.sqrt(x**2 + y**2)


def get_angle_and_distance_to_index(i, j, square_coords) -> tuple[float, float]:
    x, y = square_coords[i][j]
    return get_angle_to_coords(x, y), get_distance_to_coords(x, y)


square_coords = get_square_coords(
    n_rows=10,
    n_cols=10,
    box_height=100,
    box_width=100,
    square_height=10,
    square_width=10,
    left_bottom_corner_x=0,
    left_bottom_corner_y=0,
)
print(get_angle_and_distance_to_index(0, 0, square_coords=square_coords))
