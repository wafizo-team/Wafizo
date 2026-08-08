import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  override canActivate(
    context: ExecutionContext,
  ): ReturnType<ParentGuard['canActivate']> {
    return super.canActivate(context);
  }
}

type ParentGuard = InstanceType<ReturnType<typeof AuthGuard>>;
