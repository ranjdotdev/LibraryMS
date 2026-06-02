# `which dotnet` points to the mise shim (a wrapper, not a symlink), so
# readlink -f resolves to the mise binary instead of the real dotnet. Ask
# mise directly. If you stop using mise, change to `dirname $(which dotnet)`.
export DOTNET_ROOT := `mise where dotnet`
export PATH := env_var('HOME') + "/.dotnet/tools:" + env_var('PATH')

up:
    docker compose up -d

down:
    docker compose down

migration name:
    dotnet ef migrations add {{name}} \
        --project src/LibraryMS.Api \
        --output-dir Infrastructure/Persistence/Migrations

migrate:
    dotnet ef database update --project src/LibraryMS.Api

drop:
    dotnet ef database drop --project src/LibraryMS.Api --force

run:
    dotnet run --project src/LibraryMS.Api

watch:
    dotnet watch run --project src/LibraryMS.Api

reset: drop migrate
